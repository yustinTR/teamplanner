import type { Tables, TablesInsert, TablesUpdate, Enums } from "@/lib/supabase/types";

export type Team = Tables<"teams">;
export type TeamInsert = TablesInsert<"teams">;
export type TeamUpdate = TablesUpdate<"teams">;
export type TeamType = Enums<"team_type">;
