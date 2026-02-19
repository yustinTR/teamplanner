import type { Tables, TablesInsert } from "@/lib/supabase/types";

export type Lineup = Tables<"lineups">;
export type LineupInsert = TablesInsert<"lineups">;

export interface LineupPosition {
  player_id: string;
  x: number;
  y: number;
  position_label: string;
}
