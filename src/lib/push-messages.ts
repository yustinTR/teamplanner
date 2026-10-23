import { formatDateShort } from "@/lib/utils";
import type { MatchChange } from "@/lib/match-sync";
import type { LineupPosition, SubstitutionPlan } from "@/types";

/** What the service worker receives; `url` is where a tap navigates to. */
export interface PushPayload {
  title: string;
  body: string;
  url: string;
  tag?: string;
}

interface MatchInfo {
  id: string;
  teamName: string;
  opponent: string;
  matchDate: string;
}

export function buildAvailabilityReminder(match: MatchInfo): PushPayload {
  return {
    title: "Kun je spelen?",
    body: `${match.teamName} – ${match.opponent}, ${formatDateShort(match.matchDate)}. Geef je beschikbaarheid door.`,
    url: `/matches/${match.id}`,
    tag: `availability-${match.id}`,
  };
}

export function buildLineupPublished(match: MatchInfo): PushPayload {
  return {
    title: "Opstelling bekend",
    body: `${match.teamName} – ${match.opponent}, ${formatDateShort(match.matchDate)}. Bekijk je positie.`,
    url: `/matches/${match.id}`,
    tag: `lineup-${match.id}`,
  };
}

function describeChange(change: MatchChange): string {
  const when = formatDateShort(change.matchDate);
  switch (change.type) {
    case "created":
      return `Nieuwe wedstrijd tegen ${change.opponent} op ${when}.`;
    case "updated":
      return `Wedstrijd tegen ${change.opponent} is gewijzigd: ${when}.`;
    case "result":
      return `Uitslag bekend van de wedstrijd tegen ${change.opponent}.`;
  }
}

export function buildSyncSummary(
  teamId: string,
  teamName: string,
  changes: MatchChange[]
): PushPayload {
  const body =
    changes.length === 1
      ? describeChange(changes[0])
      : `${changes.length} wijzigingen in het programma van ${teamName}.`;
  return {
    title: "Programma bijgewerkt",
    body,
    url: "/matches",
    tag: `sync-${teamId}`,
  };
}

export function buildSyncFailure(
  teamId: string,
  teamName: string,
  error: string
): PushPayload {
  return {
    title: "Synchronisatie mislukt",
    body: `${teamName}: ${error}`,
    url: "/team/settings/import",
    tag: `sync-error-${teamId}`,
  };
}

/** Operator alert for a run in which one or more teams failed. */
export function buildSyncRunAlert(failed: number, total: number): PushPayload {
  return {
    title: "Sync: fouten in de dagelijkse run",
    body: `${failed} van ${total} teams kon niet worden gesynchroniseerd.`,
    url: "/team/settings/import",
    tag: "sync-run-alert",
  };
}

/**
 * Player ids that are part of a saved lineup: everyone on the pitch plus
 * everyone who comes on in the substitution plan. Loan players
 * (`is_match_player`) have no account and are skipped.
 */
export function lineupPlayerIds(
  positions: LineupPosition[],
  substitutionPlan: SubstitutionPlan | null | undefined
): string[] {
  const ids = new Set<string>();
  for (const position of positions) {
    if (!position.is_match_player) ids.add(position.player_id);
  }
  for (const moment of substitutionPlan?.substitutionMoments ?? []) {
    for (const sub of moment.in) ids.add(sub.player_id);
  }
  return [...ids];
}

/**
 * User ids of players who have an account but no availability answer yet.
 */
export function usersWithoutResponse(
  players: { id: string; user_id: string | null }[],
  availability: { player_id: string }[]
): string[] {
  const answered = new Set(availability.map((a) => a.player_id));
  const userIds = new Set<string>();
  for (const player of players) {
    if (player.user_id && !answered.has(player.id)) userIds.add(player.user_id);
  }
  return [...userIds];
}
