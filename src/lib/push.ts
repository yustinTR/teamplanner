import webpush from "web-push";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { PushPayload } from "@/lib/push-messages";

type Client = SupabaseClient<Database>;

export interface SendResult {
  sent: number;
  removed: number;
  failed: number;
}

let vapidConfigured = false;

/**
 * Configure VAPID once per process. Returns false when the keys are not
 * set, so callers can skip sending without failing their own work.
 */
function configureVapid(): boolean {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return false;
  if (!vapidConfigured) {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT ?? "https://www.myteamplanner.nl",
      publicKey,
      privateKey
    );
    vapidConfigured = true;
  }
  return true;
}

/**
 * Send one Web Push message to every web subscription of the given users.
 * Server-only: needs the service-role client because subscriptions are
 * RLS-protected per user. Subscriptions the push service reports as gone
 * (404/410) are deleted.
 */
export async function sendPushToUsers(
  supabase: Client,
  userIds: string[],
  payload: PushPayload
): Promise<SendResult> {
  const result: SendResult = { sent: 0, removed: 0, failed: 0 };
  const ids = [...new Set(userIds)];
  if (ids.length === 0 || !configureVapid()) return result;

  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("platform", "web")
    .in("user_id", ids);
  if (error || !subscriptions) {
    result.failed = ids.length;
    return result;
  }

  const body = JSON.stringify(payload);
  const gone: string[] = [];

  await Promise.all(
    subscriptions.map(async (subscription) => {
      if (!subscription.p256dh || !subscription.auth) return;
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: { p256dh: subscription.p256dh, auth: subscription.auth },
          },
          body,
          { TTL: 24 * 60 * 60 }
        );
        result.sent += 1;
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          gone.push(subscription.id);
        } else {
          result.failed += 1;
        }
      }
    })
  );

  if (gone.length > 0) {
    await supabase.from("push_subscriptions").delete().in("id", gone);
    result.removed = gone.length;
  }

  return result;
}

/** User ids of a team's coach and admins: the people who fix things. */
export async function teamAdminUserIds(
  supabase: Client,
  teamId: string
): Promise<string[]> {
  const [teamRes, adminsRes] = await Promise.all([
    supabase.from("teams").select("created_by").eq("id", teamId).single(),
    supabase
      .from("players")
      .select("user_id")
      .eq("team_id", teamId)
      .eq("is_admin", true)
      .eq("is_active", true)
      .not("user_id", "is", null),
  ]);
  const ids = new Set<string>();
  if (teamRes.data?.created_by) ids.add(teamRes.data.created_by);
  for (const admin of adminsRes.data ?? []) {
    if (admin.user_id) ids.add(admin.user_id);
  }
  return [...ids];
}

/**
 * Operators who want to hear about failed sync runs: comma-separated auth
 * user ids in SYNC_ALERT_USER_IDS. Empty when unset.
 */
export function operatorUserIds(): string[] {
  return (process.env.SYNC_ALERT_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

/** Active, account-holding, non-staff members of a team. */
export async function teamMemberUserIds(
  supabase: Client,
  teamId: string
): Promise<string[]> {
  const { data } = await supabase
    .from("players")
    .select("user_id")
    .eq("team_id", teamId)
    .eq("is_active", true)
    .not("user_id", "is", null);
  return (data ?? []).flatMap((p) => (p.user_id ? [p.user_id] : []));
}
