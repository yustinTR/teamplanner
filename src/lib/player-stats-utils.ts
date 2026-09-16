import type {
  PlayerAttendance,
  PlayerSeasonStats,
  TeamSeasonSummary,
} from "@/types";
import type { SubstitutionPlan } from "@/types/lineup";

interface MatchStatsRow {
  player_id: string;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
}

interface LineupRow {
  match_id: string;
  substitution_plan: unknown;
  positions?: unknown;
}

interface PlayerInfo {
  id: string;
  name: string;
}

/**
 * Aggregate season stats for a list of players from lineups and match stats data.
 */
export function aggregatePlayerStats(
  players: PlayerInfo[],
  lineups: LineupRow[],
  matchStats: MatchStatsRow[],
  defaultMatchMinutes = 90
): PlayerSeasonStats[] {
  return players.map((player) => {
    let matchesPlayed = 0;
    let totalMinutes = 0;

    for (const lineup of lineups) {
      // Try playerMinutes first (has minutes data)
      const plan =
        lineup.substitution_plan as unknown as SubstitutionPlan | null;
      if (plan?.playerMinutes) {
        const pm = plan.playerMinutes.find((p) => p.player_id === player.id);
        if (pm && pm.totalMinutes > 0) {
          matchesPlayed++;
          totalMinutes += pm.totalMinutes;
          continue;
        }
      }

      // Fallback: check positions
      if (lineup.positions) {
        const positions = lineup.positions as unknown as Array<{ player_id: string }>;
        if (positions.some((p) => p.player_id === player.id)) {
          matchesPlayed++;
          // Estimate full match minutes from plan or team-type default
          totalMinutes += plan?.totalMinutes ?? defaultMatchMinutes;
        }
      }
    }

    const playerStats = matchStats.filter((s) => s.player_id === player.id);
    let goals = 0,
      assists = 0,
      yellowCards = 0,
      redCards = 0;
    for (const s of playerStats) {
      goals += s.goals;
      assists += s.assists;
      yellowCards += s.yellow_cards;
      redCards += s.red_cards;
    }

    return {
      playerId: player.id,
      playerName: player.name,
      matchesPlayed,
      totalMinutes,
      averageMinutes:
        matchesPlayed > 0 ? Math.round(totalMinutes / matchesPlayed) : 0,
      goals,
      assists,
      yellowCards,
      redCards,
    };
  });
}

interface AvailabilityRow {
  player_id: string;
  match_id: string;
  status: "available" | "unavailable" | "maybe";
}

/**
 * Aggregate availability responses per player over a set of matches.
 * Rates are relative to the number of matches, so a player who never
 * responds scores 0 on both.
 */
export function aggregateAttendance(
  players: PlayerInfo[],
  availability: AvailabilityRow[],
  matchCount: number
): PlayerAttendance[] {
  return players.map((player) => {
    const responses = availability.filter((a) => a.player_id === player.id);
    const availableCount = responses.filter(
      (a) => a.status === "available"
    ).length;
    return {
      playerId: player.id,
      playerName: player.name,
      respondedCount: responses.length,
      availableCount,
      responseRate:
        matchCount > 0 ? Math.round((responses.length / matchCount) * 100) : 0,
      availableRate:
        matchCount > 0 ? Math.round((availableCount / matchCount) * 100) : 0,
    };
  });
}

interface CompletedMatchRow {
  home_away: "home" | "away";
  score_home: number | null;
  score_away: number | null;
}

/**
 * Aggregate season results (W/D/L, goals for/against) from completed
 * matches. Matches without a score are skipped.
 */
export function aggregateTeamResults(
  matches: CompletedMatchRow[]
): TeamSeasonSummary {
  const summary: TeamSeasonSummary = {
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
  };

  for (const match of matches) {
    if (match.score_home === null || match.score_away === null) continue;
    const goalsFor =
      match.home_away === "home" ? match.score_home : match.score_away;
    const goalsAgainst =
      match.home_away === "home" ? match.score_away : match.score_home;
    summary.played++;
    summary.goalsFor += goalsFor;
    summary.goalsAgainst += goalsAgainst;
    if (goalsFor > goalsAgainst) summary.wins++;
    else if (goalsFor < goalsAgainst) summary.losses++;
    else summary.draws++;
  }

  return summary;
}

/**
 * Find the player with the highest value for a given stat key.
 * Returns undefined if no players have a value > 0.
 */
export function findTopPlayer(
  stats: PlayerSeasonStats[],
  key: keyof Pick<
    PlayerSeasonStats,
    "totalMinutes" | "goals" | "matchesPlayed" | "assists"
  >
): PlayerSeasonStats | undefined {
  if (stats.length === 0) return undefined;
  const top = stats.reduce((a, b) => (b[key] > a[key] ? b : a));
  return top[key] > 0 ? top : undefined;
}
