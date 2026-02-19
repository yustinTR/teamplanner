import type { Tables, TablesInsert, TablesUpdate } from "@/lib/supabase/types";

export type Team = Tables<"teams">;
export type TeamInsert = TablesInsert<"teams">;
export type TeamUpdate = TablesUpdate<"teams">;
