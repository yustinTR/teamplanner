import type { Tables, TablesInsert, Enums } from "@/lib/supabase/types";
import type { Player } from "./player";

export type Availability = Tables<"availability">;
export type AvailabilityInsert = TablesInsert<"availability">;
export type AvailabilityStatus = Enums<"availability_status">;

export interface AvailabilityWithPlayer extends Availability {
  players: Player;
}
