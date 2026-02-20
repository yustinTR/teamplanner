import type { Tables, TablesInsert } from "@/lib/supabase/types";

export type Lineup = Tables<"lineups">;
export type LineupInsert = TablesInsert<"lineups">;

export interface LineupPosition {
  player_id: string;
  x: number;
  y: number;
  position_label: string;
  is_match_player?: boolean;
}

export interface SubstitutionMoment {
  minute: number;
  out: { player_id: string; name: string; position_label: string }[];
  in: { player_id: string; name: string; position_label: string }[];
}

export interface SubstitutionPlan {
  teamType: string;
  totalMinutes: number;
  substitutionMoments: SubstitutionMoment[];
  playerMinutes: {
    player_id: string;
    name: string;
    totalMinutes: number;
    percentage: number;
    periods: { start: number; end: number }[];
  }[];
}
