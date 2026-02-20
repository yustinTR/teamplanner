import type { Tables, TablesInsert, TablesUpdate, Enums } from "@/lib/supabase/types";
import type { Player } from "./player";

export type Event = Tables<"events">;
export type EventInsert = TablesInsert<"events">;
export type EventUpdate = TablesUpdate<"events">;

export type EventAttendance = Tables<"event_attendance">;
export type EventAttendanceInsert = TablesInsert<"event_attendance">;
export type AttendanceStatus = Enums<"attendance_status">;

export type EventTask = Tables<"event_tasks">;
export type EventTaskInsert = TablesInsert<"event_tasks">;
export type EventTaskUpdate = TablesUpdate<"event_tasks">;

export interface EventAttendanceWithPlayer extends EventAttendance {
  players: Player;
}
