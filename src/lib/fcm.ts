import { JWT } from "google-auth-library";
import type { PushPayload } from "@/lib/push-messages";

/**
 * Firebase Cloud Messaging (HTTP v1) for the Android app. Separate sending
 * path from Web Push on purpose (brain: push-per-client-web-first); the
 * payload shape is shared. Credentials: a Firebase service-account JSON in
 * FCM_SERVICE_ACCOUNT_JSON (raw or base64), server-only.
 */

interface ServiceAccount {
  project_id: string;
  client_email: string;
  private_key: string;
}

let cached: { account: ServiceAccount; client: JWT } | null = null;

function loadServiceAccount(): ServiceAccount | null {
  const raw = process.env.FCM_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  const text = raw.trim().startsWith("{")
    ? raw
    : Buffer.from(raw, "base64").toString("utf8");
  const parsed = JSON.parse(text) as Partial<ServiceAccount>;
  if (!parsed.project_id || !parsed.client_email || !parsed.private_key) return null;
  return parsed as ServiceAccount;
}

function getClient(): { account: ServiceAccount; client: JWT } | null {
  if (cached) return cached;
  const account = loadServiceAccount();
  if (!account) return null;
  const client = new JWT({
    email: account.client_email,
    key: account.private_key,
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  });
  cached = { account, client };
  return cached;
}

export function fcmConfigured(): boolean {
  return getClient() !== null;
}

/** FCM data message: the app's messaging service renders the notification. */
export function buildFcmMessage(token: string, payload: PushPayload) {
  return {
    message: {
      token,
      data: {
        title: payload.title,
        body: payload.body,
        url: payload.url,
        ...(payload.tag ? { tag: payload.tag } : {}),
      },
      android: { priority: "high" as const },
    },
  };
}

export type FcmSendResult = "sent" | "gone" | "failed";

/** Send one data message; "gone" means the token is no longer registered. */
export async function sendFcm(token: string, payload: PushPayload): Promise<FcmSendResult> {
  const config = getClient();
  if (!config) return "failed";
  const { token: accessToken } = await config.client.getAccessToken();
  if (!accessToken) return "failed";

  const response = await fetch(
    `https://fcm.googleapis.com/v1/projects/${config.account.project_id}/messages:send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildFcmMessage(token, payload)),
    }
  );
  if (response.ok) return "sent";
  if (response.status === 404) return "gone";
  const text = await response.text().catch(() => "");
  if (text.includes("UNREGISTERED") || text.includes("INVALID_ARGUMENT")) return "gone";
  return "failed";
}
