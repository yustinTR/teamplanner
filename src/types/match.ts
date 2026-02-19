import type { Tables, TablesInsert, TablesUpdate, Enums } from "@/lib/supabase/types";

export type Match = Tables<"matches">;
export type MatchInsert = TablesInsert<"matches">;
export type MatchUpdate = TablesUpdate<"matches">;
export type MatchStatus = Enums<"match_status">;
export type HomeAway = Enums<"home_away">;
