import type { PlayerAttendance, PlayerSeasonStats, TeamSeasonSummary } from "@/types";

export interface SeasonReviewEntry {
  name: string;
  value: number;
}

export interface SeasonReview {
  summary: TeamSeasonSummary;
  topScorers: SeasonReviewEntry[];
  topAssists: SeasonReviewEntry[];
  /** Highest share of matches marked "available", 0–100. */
  bestAttendance: SeasonReviewEntry[];
}

const TOP = 3;

function top(entries: SeasonReviewEntry[]): SeasonReviewEntry[] {
  return entries
    .filter((e) => e.value > 0)
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name))
    .slice(0, TOP);
}

/**
 * The few numbers a season card shows: record, top three scorers and
 * assisters, and the three most reliable players. Attendance only counts
 * players who answered at least half as often as the most active one, so a
 * player who replied once does not top the list.
 */
export function buildSeasonReview(
  summary: TeamSeasonSummary,
  playerStats: PlayerSeasonStats[],
  attendance: PlayerAttendance[]
): SeasonReview {
  const maxResponded = Math.max(0, ...attendance.map((a) => a.respondedCount));
  return {
    summary,
    topScorers: top(playerStats.map((p) => ({ name: p.playerName, value: p.goals }))),
    topAssists: top(playerStats.map((p) => ({ name: p.playerName, value: p.assists }))),
    bestAttendance: top(
      attendance
        .filter((a) => maxResponded > 0 && a.respondedCount * 2 >= maxResponded)
        .map((a) => ({ name: a.playerName, value: a.availableRate }))
    ),
  };
}
