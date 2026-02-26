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
