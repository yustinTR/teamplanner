import type { Tables, TablesInsert } from "@/lib/supabase/types";

export type MatchPlayer = Tables<"match_players">;
export type MatchPlayerInsert = TablesInsert<"match_players">;
