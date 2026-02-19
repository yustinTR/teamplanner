import type { Tables, TablesInsert, TablesUpdate } from "@/lib/supabase/types";

export type Player = Tables<"players">;
export type PlayerInsert = TablesInsert<"players">;
export type PlayerUpdate = TablesUpdate<"players">;
