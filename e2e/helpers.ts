import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * E2E test helpers.
 *
 * Uses SUPABASE_SERVICE_ROLE_KEY (admin) to create test users
 * without email confirmation. Works against hosted Supabase.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const TEST_EMAIL = "e2e-test@teamplanner.test";
export const TEST_PASSWORD = "E2eTestPassword2026!";

/**
 * Admin client (service_role) — bypasses RLS, can manage users.
 */
export function createAdminClient(): SupabaseClient {
  if (!SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. " +
        "Add it as a GitHub Secret or pass it as an env var."
    );
  }
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Create a confirmed test user via the admin API (no email confirmation).
 */
export async function createTestUser(admin: SupabaseClient): Promise<string> {
  const { data: list } = await admin.auth.admin.listUsers();
  const existing = list?.users?.find((u) => u.email === TEST_EMAIL);
  if (existing) return existing.id;

  const { data, error } = await admin.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true,
    user_metadata: { name: "E2E Test Coach" },
  });

  if (error) throw new Error(`Failed to create test user: ${error.message}`);
  return data.user.id;
}

/**
 * Delete the test user and all related data (cleanup after tests).
 */
export async function deleteTestUser(admin: SupabaseClient): Promise<void> {
  const { data: list } = await admin.auth.admin.listUsers();
  const user = list?.users?.find((u) => u.email === TEST_EMAIL);
  if (!user) return;

  // Delete team data (cascades via foreign keys)
  const { data: team } = await admin
    .from("teams")
    .select("id")
    .eq("created_by", user.id)
    .limit(1)
    .single();

  if (team) {
    await admin.from("availability").delete().in(
      "match_id",
      (
        await admin.from("matches").select("id").eq("team_id", team.id)
      ).data?.map((m) => m.id) ?? []
    );
    await admin.from("lineups").delete().in(
      "match_id",
      (
        await admin.from("matches").select("id").eq("team_id", team.id)
      ).data?.map((m) => m.id) ?? []
    );
    await admin.from("matches").delete().eq("team_id", team.id);
    await admin.from("players").delete().eq("team_id", team.id);
    await admin.from("teams").delete().eq("id", team.id);
  }

  await admin.auth.admin.deleteUser(user.id);
}

/**
 * Ensure the test user has a team.
 */
export async function ensureTestTeam(
  admin: SupabaseClient,
  userId: string
) {
  const { data: existing } = await admin
    .from("teams")
    .select("*")
    .eq("created_by", userId)
    .limit(1)
    .single();

  if (existing) return existing;

  const { data, error } = await admin
    .from("teams")
    .insert({ name: "E2E Test Team", club_name: "E2E FC", created_by: userId })
    .select()
    .single();

  if (error) throw new Error(`Failed to create team: ${error.message}`);
  return data!;
}

/**
 * Ensure enough players exist for the team.
 */
export async function ensureTestPlayers(
  admin: SupabaseClient,
  teamId: string,
  count = 14
) {
  const { data: existing } = await admin
    .from("players")
    .select("*")
    .eq("team_id", teamId)
    .eq("is_active", true)
    .order("name");

  if (existing && existing.length >= count) return existing;

  const positions = [
    "K", "CB", "LB", "RB", "CB",
    "CM", "CM", "CDM",
    "LW", "ST", "RW",
    "K", "CB", "CM",
  ];
  const names = [
    "Jan de Keeper", "Piet Achter", "Klaas Achter", "Willem Achter",
    "Henk Achter", "Joop Midden", "Kees Midden", "Dirk Midden",
    "Sjaak Voor", "Ruud Voor", "Marco Voor",
    "Tom Reserve", "Bas Reserve", "Erik Reserve",
  ];

  const currentCount = existing?.length ?? 0;
  const toCreate = count - currentCount;

  if (toCreate > 0) {
    const newPlayers = Array.from({ length: toCreate }, (_, i) => ({
      team_id: teamId,
      name: names[currentCount + i] ?? `Speler ${currentCount + i + 1}`,
      primary_position: positions[currentCount + i] ?? "CM",
      jersey_number: currentCount + i + 1,
    }));
    await admin.from("players").insert(newPlayers);
  }

  const { data } = await admin
    .from("players")
    .select("*")
    .eq("team_id", teamId)
    .eq("is_active", true)
    .order("name");

  return data ?? [];
}

/**
 * Ensure an upcoming test match exists.
 */
export async function ensureTestMatch(
  admin: SupabaseClient,
  teamId: string
) {
  const { data: existing } = await admin
    .from("matches")
    .select("*")
    .eq("team_id", teamId)
    .eq("status", "upcoming")
    .limit(1)
    .single();

  if (existing) return existing;

  const { data, error } = await admin
    .from("matches")
    .insert({
      team_id: teamId,
      opponent: "E2E Tegenstander",
      match_date: new Date(Date.now() + 7 * 86400000).toISOString(),
      home_away: "home",
      location: "E2E Sportpark",
      status: "upcoming",
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create match: ${error.message}`);
  return data!;
}

/**
 * Set all players as available for a match.
 */
export async function setAllAvailable(
  admin: SupabaseClient,
  matchId: string,
  playerIds: string[]
) {
  const records = playerIds.map((id) => ({
    match_id: matchId,
    player_id: id,
    status: "available" as const,
  }));

  await admin
    .from("availability")
    .upsert(records, { onConflict: "player_id,match_id" });
}
