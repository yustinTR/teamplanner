import type { Tables, TablesInsert, TablesUpdate } from "@/lib/supabase/types";

export type MatchStats = Tables<"match_stats">;
export type MatchStatsInsert = TablesInsert<"match_stats">;
export type MatchStatsUpdate = TablesUpdate<"match_stats">;

export interface PlayerSeasonStats {
  playerId: string;
  playerName: string;
  matchesPlayed: number;
  totalMinutes: number;
  averageMinutes: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

export interface PlayerAttendance {
  playerId: string;
  playerName: string;
  respondedCount: number;
  availableCount: number;
  responseRate: number;
  availableRate: number;
}

export interface TeamSeasonSummary {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}
