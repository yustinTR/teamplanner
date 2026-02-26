import type { LineupPosition } from "@/types/lineup";

// --- Team type configuration ---

export interface TeamTypeConfig {
  label: string;
  halfMinutes: number;
  halves: number;
  fieldPlayers: number;
}

export const TEAM_TYPE_CONFIG: Record<string, TeamTypeConfig> = {
  senioren: { label: "Senioren", halfMinutes: 45, halves: 2, fieldPlayers: 11 },
  jo19_jo17: { label: "JO19 - JO17", halfMinutes: 40, halves: 2, fieldPlayers: 11 },
  jo15_jo13: { label: "JO15 - JO13", halfMinutes: 30, halves: 2, fieldPlayers: 7 },
  jo11_jo9: { label: "JO11 - JO9", halfMinutes: 25, halves: 2, fieldPlayers: 7 },
  g_team: { label: "G-Team", halfMinutes: 25, halves: 2, fieldPlayers: 8 },
  // Legacy values (still valid in DB, mapped to new configs)
  jo19_jo15: { label: "JO19 - JO15", halfMinutes: 40, halves: 2, fieldPlayers: 11 },
  jo13_jo11: { label: "JO13 - JO11", halfMinutes: 30, halves: 2, fieldPlayers: 7 },
  jo9_jo7: { label: "JO9 - JO7", halfMinutes: 25, halves: 2, fieldPlayers: 7 },
};

// Only show these team types in the UI (excludes legacy values)
export const ACTIVE_TEAM_TYPES = ["senioren", "jo19_jo17", "jo15_jo13", "jo11_jo9", "g_team"] as const;

export const TEAM_TYPE_LABELS: Record<string, string> = {
  senioren: "Senioren",
  jo19_jo17: "JO19 - JO17",
  jo15_jo13: "JO15 - JO13",
  jo11_jo9: "JO11 - JO9",
  g_team: "G-Team",
  // Legacy
  jo19_jo15: "JO19 - JO15",
  jo13_jo11: "JO13 - JO11",
  jo9_jo7: "JO9 - JO7",
};

// --- Attendance labels (events) ---

export const ATTENDANCE_LABELS: Record<string, string> = {
  coming: "Aanwezig",
  not_coming: "Afwezig",
  maybe: "Misschien",
};

// --- Formations ---

// 11v11 formations (senioren, JO19-JO17)
export const FORMATIONS_11: Record<string, Omit<LineupPosition, "player_id">[]> = {
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

// 8v8 formations (G-team)
export const FORMATIONS_8: Record<string, Omit<LineupPosition, "player_id">[]> = {
  "3-3-1": [
    { x: 50, y: 92, position_label: "K" },
    { x: 20, y: 72, position_label: "LB" },
    { x: 50, y: 75, position_label: "CB" },
    { x: 80, y: 72, position_label: "RB" },
    { x: 20, y: 48, position_label: "LM" },
    { x: 50, y: 45, position_label: "CM" },
    { x: 80, y: 48, position_label: "RM" },
    { x: 50, y: 20, position_label: "ST" },
  ],
  "2-4-1": [
    { x: 50, y: 92, position_label: "K" },
    { x: 30, y: 72, position_label: "CB" },
    { x: 70, y: 72, position_label: "CB" },
    { x: 15, y: 48, position_label: "LM" },
    { x: 38, y: 50, position_label: "CM" },
    { x: 62, y: 50, position_label: "CM" },
    { x: 85, y: 48, position_label: "RM" },
    { x: 50, y: 20, position_label: "ST" },
  ],
  "2-3-2": [
    { x: 50, y: 92, position_label: "K" },
    { x: 30, y: 72, position_label: "CB" },
    { x: 70, y: 72, position_label: "CB" },
    { x: 20, y: 48, position_label: "LM" },
    { x: 50, y: 45, position_label: "CM" },
    { x: 80, y: 48, position_label: "RM" },
    { x: 35, y: 20, position_label: "ST" },
    { x: 65, y: 20, position_label: "ST" },
  ],
  "3-2-2": [
    { x: 50, y: 92, position_label: "K" },
    { x: 20, y: 72, position_label: "LB" },
    { x: 50, y: 75, position_label: "CB" },
    { x: 80, y: 72, position_label: "RB" },
    { x: 35, y: 48, position_label: "CM" },
    { x: 65, y: 48, position_label: "CM" },
    { x: 35, y: 20, position_label: "ST" },
    { x: 65, y: 20, position_label: "ST" },
  ],
};

// 7v7 formations (JO15 en lager)
export const FORMATIONS_7: Record<string, Omit<LineupPosition, "player_id">[]> = {
  "2-3-1": [
    { x: 50, y: 92, position_label: "K" },
    { x: 30, y: 72, position_label: "CB" },
    { x: 70, y: 72, position_label: "CB" },
    { x: 20, y: 48, position_label: "LM" },
    { x: 50, y: 45, position_label: "CM" },
    { x: 80, y: 48, position_label: "RM" },
    { x: 50, y: 20, position_label: "ST" },
  ],
  "3-2-1": [
    { x: 50, y: 92, position_label: "K" },
    { x: 20, y: 72, position_label: "LB" },
    { x: 50, y: 75, position_label: "CB" },
    { x: 80, y: 72, position_label: "RB" },
    { x: 35, y: 48, position_label: "CM" },
    { x: 65, y: 48, position_label: "CM" },
    { x: 50, y: 20, position_label: "ST" },
  ],
  "2-2-2": [
    { x: 50, y: 92, position_label: "K" },
    { x: 30, y: 72, position_label: "CB" },
    { x: 70, y: 72, position_label: "CB" },
    { x: 30, y: 48, position_label: "CM" },
    { x: 70, y: 48, position_label: "CM" },
    { x: 30, y: 22, position_label: "LW" },
    { x: 70, y: 22, position_label: "RW" },
  ],
  "1-3-2": [
    { x: 50, y: 92, position_label: "K" },
    { x: 50, y: 72, position_label: "CB" },
    { x: 20, y: 48, position_label: "LM" },
    { x: 50, y: 45, position_label: "CM" },
    { x: 80, y: 48, position_label: "RM" },
    { x: 35, y: 20, position_label: "ST" },
    { x: 65, y: 20, position_label: "ST" },
  ],
};

// Combined lookup (for backward compatibility with lineup-generator)
export const FORMATIONS: Record<string, Omit<LineupPosition, "player_id">[]> = {
  ...FORMATIONS_11,
  ...FORMATIONS_8,
  ...FORMATIONS_7,
};

// Helper to get the right formations for a team type
export function getFormationsForTeamType(teamType: string): Record<string, Omit<LineupPosition, "player_id">[]> {
  const config = TEAM_TYPE_CONFIG[teamType];
  if (config && config.fieldPlayers === 8) {
    return FORMATIONS_8;
  }
  if (config && config.fieldPlayers <= 7) {
    return FORMATIONS_7;
  }
  return FORMATIONS_11;
}

// Helper to get the default formation for a team type
export function getDefaultFormation(teamType: string): string {
  const config = TEAM_TYPE_CONFIG[teamType];
  if (config && config.fieldPlayers === 8) {
    return "3-3-1";
  }
  if (config && config.fieldPlayers <= 7) {
    return "2-3-1";
  }
  return "4-3-3";
}

export const AVAILABILITY_LABELS: Record<string, string> = {
  available: "Beschikbaar",
  unavailable: "Afwezig",
  maybe: "Misschien",
};

export const DETAILED_POSITION_LABELS: Record<string, string> = {
  K: "Keeper",
  CB: "Centrale Verdediger",
  LB: "Links Achter",
  RB: "Rechts Achter",
  LWB: "Linker Wingback",
  RWB: "Rechter Wingback",
  CM: "Centrale Middenvelder",
  CDM: "Verdedigende Middenvelder",
  CAM: "Aanvallende Middenvelder",
  LM: "Links Midden",
  RM: "Rechts Midden",
  LW: "Links Buiten",
  RW: "Rechts Buiten",
  ST: "Spits",
};

// Backward-compatible alias
export const POSITION_LABELS = DETAILED_POSITION_LABELS;

export const POSITION_GROUPS = [
  { label: "Keeper", positions: ["K"] },
  { label: "Verdediging", positions: ["CB", "LB", "RB", "LWB", "RWB"] },
  { label: "Middenveld", positions: ["CM", "CDM", "CAM", "LM", "RM"] },
  { label: "Aanval", positions: ["LW", "RW", "ST"] },
];

export const POSITION_TO_CATEGORY: Record<string, string> = {
  K: "goalkeeper",
  CB: "defender",
  LB: "defender",
  RB: "defender",
  LWB: "defender",
  RWB: "defender",
  CM: "midfielder",
  CDM: "midfielder",
  CAM: "midfielder",
  LM: "midfielder",
  RM: "midfielder",
  LW: "forward",
  RW: "forward",
  ST: "forward",
};

// --- Exercise configuration ---

export const EXERCISE_CATEGORY_LABELS: Record<string, string> = {
  warming_up: "Warming-up",
  passing: "Passing",
  positiespel: "Positiespel",
  verdedigen: "Verdedigen",
  aanvallen: "Aanvallen",
  conditie: "Conditie",
  afwerken: "Afwerken",
};

export const EXERCISE_DIFFICULTY_LABELS: Record<string, string> = {
  basis: "Basis",
  gemiddeld: "Gemiddeld",
  gevorderd: "Gevorderd",
};

export const EXERCISE_DURATION_OPTIONS = [5, 10, 12, 15, 20] as const;

export const EXERCISE_PLAYER_COUNT_OPTIONS = [
  { label: "Klein (3-6)", min: 3, max: 6 },
  { label: "Middel (7-12)", min: 7, max: 12 },
  { label: "Groot (13+)", min: 13, max: 24 },
] as const;

// --- Role labels ---

export const ROLE_LABELS: Record<string, string> = {
  player: "Speler",
  staff: "Teammanager",
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

// --- Player skills ---

export interface PlayerSkillDef {
  key: string;
  label: string;
}

export const PLAYER_SKILLS: PlayerSkillDef[] = [
  { key: "speed", label: "Snelheid" },
  { key: "strength", label: "Kracht" },
  { key: "technique", label: "Techniek" },
  { key: "passing", label: "Passing" },
  { key: "dribbling", label: "Dribbelen" },
  { key: "heading", label: "Koppen" },
  { key: "defending", label: "Verdedigen" },
  { key: "positioning", label: "Positiespel" },
  { key: "finishing", label: "Afwerken" },
  { key: "stamina", label: "Conditie" },
];

export type PlayerSkills = Record<string, number>;
