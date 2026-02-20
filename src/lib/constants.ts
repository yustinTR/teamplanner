import type { LineupPosition } from "@/types/lineup";
import type { TeamType } from "@/types/team";

// --- Team type configuration ---

export interface TeamTypeConfig {
  label: string;
  halfMinutes: number;
  halves: number;
  fieldPlayers: number;
}

export const TEAM_TYPE_CONFIG: Record<TeamType, TeamTypeConfig> = {
  senioren: { label: "Senioren", halfMinutes: 45, halves: 2, fieldPlayers: 11 },
  jo19_jo15: { label: "JO19 - JO15", halfMinutes: 40, halves: 2, fieldPlayers: 11 },
  jo13_jo11: { label: "JO13 - JO11", halfMinutes: 30, halves: 2, fieldPlayers: 11 },
  jo9_jo7: { label: "JO9 - JO7", halfMinutes: 25, halves: 2, fieldPlayers: 7 },
  g_team: { label: "G-Team", halfMinutes: 25, halves: 2, fieldPlayers: 7 },
};

export const TEAM_TYPE_LABELS: Record<TeamType, string> = {
  senioren: "Senioren",
  jo19_jo15: "JO19 - JO15",
  jo13_jo11: "JO13 - JO11",
  jo9_jo7: "JO9 - JO7",
  g_team: "G-Team",
};

// --- Attendance labels (events) ---

export const ATTENDANCE_LABELS: Record<string, string> = {
  coming: "Aanwezig",
  not_coming: "Afwezig",
  maybe: "Misschien",
};

// --- Formations ---

export const FORMATIONS: Record<string, Omit<LineupPosition, "player_id">[]> = {
  "4-3-3": [
    { x: 50, y: 92, position_label: "K" },
    { x: 15, y: 75, position_label: "LB" },
    { x: 38, y: 78, position_label: "CB" },
    { x: 62, y: 78, position_label: "CB" },
    { x: 85, y: 75, position_label: "RB" },
    { x: 25, y: 55, position_label: "CM" },
    { x: 50, y: 50, position_label: "CM" },
    { x: 75, y: 55, position_label: "CM" },
    { x: 15, y: 25, position_label: "LW" },
    { x: 50, y: 20, position_label: "ST" },
    { x: 85, y: 25, position_label: "RW" },
  ],
  "4-4-2": [
    { x: 50, y: 92, position_label: "K" },
    { x: 15, y: 75, position_label: "LB" },
    { x: 38, y: 78, position_label: "CB" },
    { x: 62, y: 78, position_label: "CB" },
    { x: 85, y: 75, position_label: "RB" },
    { x: 15, y: 50, position_label: "LM" },
    { x: 38, y: 55, position_label: "CM" },
    { x: 62, y: 55, position_label: "CM" },
    { x: 85, y: 50, position_label: "RM" },
    { x: 35, y: 22, position_label: "ST" },
    { x: 65, y: 22, position_label: "ST" },
  ],
  "3-5-2": [
    { x: 50, y: 92, position_label: "K" },
    { x: 25, y: 78, position_label: "CB" },
    { x: 50, y: 80, position_label: "CB" },
    { x: 75, y: 78, position_label: "CB" },
    { x: 10, y: 50, position_label: "LWB" },
    { x: 35, y: 55, position_label: "CM" },
    { x: 50, y: 48, position_label: "CM" },
    { x: 65, y: 55, position_label: "CM" },
    { x: 90, y: 50, position_label: "RWB" },
    { x: 35, y: 22, position_label: "ST" },
    { x: 65, y: 22, position_label: "ST" },
  ],
  "4-2-3-1": [
    { x: 50, y: 92, position_label: "K" },
    { x: 15, y: 75, position_label: "LB" },
    { x: 38, y: 78, position_label: "CB" },
    { x: 62, y: 78, position_label: "CB" },
    { x: 85, y: 75, position_label: "RB" },
    { x: 35, y: 58, position_label: "CDM" },
    { x: 65, y: 58, position_label: "CDM" },
    { x: 15, y: 35, position_label: "LW" },
    { x: 50, y: 38, position_label: "CAM" },
    { x: 85, y: 35, position_label: "RW" },
    { x: 50, y: 15, position_label: "ST" },
  ],
};

export const AVAILABILITY_LABELS: Record<string, string> = {
  available: "Beschikbaar",
  unavailable: "Afwezig",
  maybe: "Misschien",
};

export const POSITION_LABELS: Record<string, string> = {
  goalkeeper: "Keeper",
  defender: "Verdediger",
  midfielder: "Middenvelder",
  forward: "Aanvaller",
};

export const MATCH_STATUS_LABELS: Record<string, string> = {
  upcoming: "Gepland",
  completed: "Gespeeld",
  cancelled: "Afgelast",
};

export const HOME_AWAY_LABELS: Record<string, string> = {
  home: "Thuis",
  away: "Uit",
};
