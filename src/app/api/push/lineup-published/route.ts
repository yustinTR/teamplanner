import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPushToUsers } from "@/lib/push";
import { buildLineupPublished, lineupPlayerIds } from "@/lib/push-messages";
import type { LineupPosition, SubstitutionPlan } from "@/types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Called by the lineup editor after a save: notify every selected player
 * with an account, except the coach who saved. Only coaches/admins of the
 * match's team may trigger it.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  let matchId: unknown;
  try {
    ({ matchId } = await request.json());
  } catch {
    return NextResponse.json({ error: "Ongeldige request body." }, { status: 400 });
  }
  if (typeof matchId !== "string" || !UUID_RE.test(matchId)) {
    return NextResponse.json({ error: "Ongeldig match ID." }, { status: 400 });
  }

  // RLS limits this to matches of the user's own teams
  const { data: match } = await supabase
    .from("matches")
    .select("id, team_id, opponent, match_date, teams(name)")
    .eq("id", matchId)
    .single();
  if (!match) {
    return NextResponse.json({ error: "Wedstrijd niet gevonden." }, { status: 404 });
  }

  const { data: isAdmin } = await supabase.rpc("is_team_admin", {
    check_team_id: match.team_id,
  });
  if (!isAdmin) {
    return NextResponse.json({ error: "Alleen coaches kunnen dit doen." }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data: lineup } = await admin
    .from("lineups")
    .select("positions, substitution_plan")
    .eq("match_id", matchId)
    .single();
  if (!lineup) {
    return NextResponse.json({ sent: 0 });
  }

  const playerIds = lineupPlayerIds(
    (lineup.positions as unknown as LineupPosition[]) ?? [],
    lineup.substitution_plan as unknown as SubstitutionPlan | null
  );
  if (playerIds.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const { data: players } = await admin
    .from("players")
    .select("user_id")
    .in("id", playerIds)
    .not("user_id", "is", null);
  const userIds = (players ?? [])
    .flatMap((p) => (p.user_id ? [p.user_id] : []))
    .filter((id) => id !== user.id);

  const result = await sendPushToUsers(
    admin,
    userIds,
    buildLineupPublished({
      id: match.id,
      teamName: match.teams?.name ?? "Je team",
      opponent: match.opponent,
      matchDate: match.match_date,
    })
  );

  return NextResponse.json(result);
}
