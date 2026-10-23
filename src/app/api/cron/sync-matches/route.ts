import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getMatchesFromApi,
  getLocationsFromIcal,
  enrichMatchesWithLocations,
} from "@/lib/voetbal-nl-parser";
import { upsertMatches, applyResults } from "@/lib/match-sync";
import {
  operatorUserIds,
  sendPushToUsers,
  teamAdminUserIds,
  teamMemberUserIds,
} from "@/lib/push";
import {
  buildSyncFailure,
  buildSyncRunAlert,
  buildSyncSummary,
} from "@/lib/push-messages";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface TeamSyncSummary {
  teamId: string;
  teamName: string;
  matchesCreated: number;
  matchesUpdated: number;
  resultsUpdated: number;
  pushSent: number;
  errors: string[];
}

/**
 * Daily cron (see vercel.json): refresh matches and results for all teams
 * with a linked import source. Vercel sends `Authorization: Bearer CRON_SECRET`.
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

  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select(
      "id, name, import_club_abbrev, import_team_name, import_team_id, import_team_url"
    )
    .eq("auto_sync_enabled", true)
    .not("import_club_abbrev", "is", null)
    .not("import_team_name", "is", null);

  if (teamsError) {
    await alertOperators(supabase, 1, 1);
    return NextResponse.json(
      { error: `Failed to fetch teams: ${teamsError.message}` },
      { status: 500 }
    );
  }

  const summaries: TeamSyncSummary[] = [];

  // Sequential on purpose: keeps load on the VoetbalAssist API low and
  // one failing team never aborts the rest of the run
  for (const team of teams ?? []) {
    const summary: TeamSyncSummary = {
      teamId: team.id,
      teamName: team.name,
      matchesCreated: 0,
      matchesUpdated: 0,
      resultsUpdated: 0,
      pushSent: 0,
      errors: [],
    };

    try {
      const { matches, results } = await getMatchesFromApi(
        team.import_club_abbrev!,
        team.import_team_name!
      );

      let enrichedMatches = matches;
      if (team.import_team_id && team.import_team_url) {
        try {
          const clubDomain = new URL(team.import_team_url).hostname;
          const locations = await getLocationsFromIcal(
            clubDomain,
            team.import_team_id
          );
          enrichedMatches = enrichMatchesWithLocations(matches, locations);
        } catch {
          // Location enrichment failed — continue without locations
        }
      }

      const upsertResult = await upsertMatches(
        supabase,
        team.id,
        enrichedMatches
      );
      summary.matchesCreated = upsertResult.matchesCreated;
      summary.matchesUpdated = upsertResult.matchesUpdated;
      summary.errors.push(...upsertResult.errors);

      const resultsResult = await applyResults(supabase, team.id, results);
      summary.resultsUpdated = resultsResult.resultsUpdated;
      summary.errors.push(...resultsResult.errors);

      const changes = [...upsertResult.changes, ...resultsResult.changes];
      if (changes.length > 0) {
        const { error: logError } = await supabase.from("sync_log").insert({
          team_id: team.id,
          matches_created: summary.matchesCreated,
          matches_updated: summary.matchesUpdated,
          results_updated: summary.resultsUpdated,
          changes,
        });
        if (logError) {
          summary.errors.push(`Sync log failed: ${logError.message}`);
        }

        // Tell the team; a push failure never fails the sync
        try {
          const userIds = await teamMemberUserIds(supabase, team.id);
          const pushResult = await sendPushToUsers(
            supabase,
            userIds,
            buildSyncSummary(team.id, team.name, changes)
          );
          summary.pushSent = pushResult.sent;
        } catch (pushErr) {
          summary.errors.push(
            `Push failed: ${pushErr instanceof Error ? pushErr.message : "unknown error"}`
          );
        }
      }

      await supabase
        .from("teams")
        .update({ last_synced_at: new Date().toISOString() })
        .eq("id", team.id);
    } catch (err) {
      console.error(`Sync failed for team ${team.id}:`, err);
      summary.errors.push(
        err instanceof Error ? err.message : "Unknown sync error"
      );
    }

    summaries.push(summary);
  }

  const failed = summaries.filter((s) => s.errors.length > 0);
  if (failed.length > 0) {
    // The team's coach hears about their own team; operators about the run
    for (const summary of failed) {
      try {
        const adminIds = await teamAdminUserIds(supabase, summary.teamId);
        await sendPushToUsers(
          supabase,
          adminIds,
          buildSyncFailure(summary.teamId, summary.teamName, summary.errors[0])
        );
      } catch (err) {
        console.error(`Sync failure alert failed for ${summary.teamId}:`, err);
      }
    }
    await alertOperators(supabase, failed.length, summaries.length);
  }

  return NextResponse.json({
    teamsSynced: summaries.length,
    teamsFailed: failed.length,
    summaries,
  });
}

async function alertOperators(
  supabase: ReturnType<typeof createAdminClient>,
  failed: number,
  total: number
) {
  const operators = operatorUserIds();
  if (operators.length === 0) return;
  try {
    await sendPushToUsers(supabase, operators, buildSyncRunAlert(failed, total));
  } catch (err) {
    console.error("Operator sync alert failed:", err);
  }
}
