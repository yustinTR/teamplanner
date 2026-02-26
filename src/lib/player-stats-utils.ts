import type { PlayerSeasonStats } from "@/types";
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
  matchStats: MatchStatsRow[]
): PlayerSeasonStats[] {
  return players.map((player) => {
    let matchesPlayed = 0;
    let totalMinutes = 0;

    for (const lineup of lineups) {
      const plan =
        lineup.substitution_plan as unknown as SubstitutionPlan | null;
      if (!plan?.playerMinutes) continue;
      const pm = plan.playerMinutes.find((p) => p.player_id === player.id);
      if (pm && pm.totalMinutes > 0) {
        matchesPlayed++;
        totalMinutes += pm.totalMinutes;
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
