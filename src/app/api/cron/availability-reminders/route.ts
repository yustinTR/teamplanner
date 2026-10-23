import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPushToUsers } from "@/lib/push";
import {
  buildAvailabilityReminder,
  usersWithoutResponse,
} from "@/lib/push-messages";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const REMINDER_WINDOW_DAYS = 3;

/**
 * Daily cron (see vercel.json): remind players with an account who have not
 * answered availability for a match within the next three days.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const now = new Date();
  const until = new Date(now.getTime() + REMINDER_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const { data: matches, error: matchesError } = await supabase
    .from("matches")
    .select("id, team_id, opponent, match_date, teams(name)")
    .eq("status", "upcoming")
    .gte("match_date", now.toISOString())
    .lte("match_date", until.toISOString());

  if (matchesError) {
    return NextResponse.json(
      { error: `Failed to fetch matches: ${matchesError.message}` },
      { status: 500 }
    );
  }

  if (!matches || matches.length === 0) {
    return NextResponse.json({ matches: 0, reminders: 0 });
  }

  const teamIds = [...new Set(matches.map((m) => m.team_id))];
  const matchIds = matches.map((m) => m.id);

  const [playersRes, availabilityRes] = await Promise.all([
    supabase
      .from("players")
      .select("id, team_id, user_id")
      .in("team_id", teamIds)
      .eq("is_active", true)
      .neq("role", "staff")
      .not("user_id", "is", null),
    supabase
      .from("availability")
      .select("match_id, player_id")
      .in("match_id", matchIds),
  ]);

  const players = playersRes.data ?? [];
  const availability = availabilityRes.data ?? [];

  let reminders = 0;
  const errors: string[] = [];

  for (const match of matches) {
    const teamPlayers = players.filter((p) => p.team_id === match.team_id);
    const answered = availability.filter((a) => a.match_id === match.id);
    const userIds = usersWithoutResponse(teamPlayers, answered);
    if (userIds.length === 0) continue;

    try {
      const result = await sendPushToUsers(
        supabase,
        userIds,
        buildAvailabilityReminder({
          id: match.id,
          teamName: match.teams?.name ?? "Je team",
          opponent: match.opponent,
          matchDate: match.match_date,
        })
      );
      reminders += result.sent;
    } catch (err) {
      errors.push(
        `Match ${match.id}: ${err instanceof Error ? err.message : "unknown error"}`
      );
    }
  }

  return NextResponse.json({ matches: matches.length, reminders, errors });
}
