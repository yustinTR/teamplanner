import {
  EAFC_ATTRIBUTE_CATEGORIES,
  EAFC_ATTRIBUTE_KEYS,
  type AttributeCategory,
  type PlayerSkills,
} from "./constants";

// --- Types ---

export interface SixStats {
  pac: number;
  sho: number;
  pas: number;
  dri: number;
  def: number;
  phy: number;
}

export type CardTier = "gold" | "silver" | "bronze";

// --- Position weight mappings ---

// Weights per position category for OVR calculation
// Keys match EAFC_ATTRIBUTE_CATEGORIES order: pace, shooting, passing, dribbling, defending, physical
type SixWeights = [number, number, number, number, number, number];

const POSITION_WEIGHTS: Record<string, SixWeights> = {
  // Forwards
  ST:  [0.15, 0.30, 0.10, 0.20, 0.05, 0.20],
  LW:  [0.20, 0.20, 0.15, 0.25, 0.05, 0.15],
  RW:  [0.20, 0.20, 0.15, 0.25, 0.05, 0.15],
  // Midfielders
  CM:  [0.10, 0.10, 0.25, 0.20, 0.15, 0.20],
  CAM: [0.10, 0.20, 0.20, 0.25, 0.05, 0.20],
  CDM: [0.10, 0.05, 0.15, 0.15, 0.30, 0.25],
  LM:  [0.15, 0.10, 0.20, 0.25, 0.10, 0.20],
  RM:  [0.15, 0.10, 0.20, 0.25, 0.10, 0.20],
  // Defenders
  CB:  [0.10, 0.05, 0.10, 0.10, 0.40, 0.25],
  LB:  [0.20, 0.05, 0.15, 0.15, 0.25, 0.20],
  RB:  [0.20, 0.05, 0.15, 0.15, 0.25, 0.20],
  LWB: [0.20, 0.05, 0.15, 0.15, 0.25, 0.20],
  RWB: [0.20, 0.05, 0.15, 0.15, 0.25, 0.20],
  // Goalkeeper
  K:   [0.05, 0.05, 0.15, 0.10, 0.25, 0.40],
};

const DEFAULT_WEIGHTS: SixWeights = [0.15, 0.15, 0.15, 0.15, 0.15, 0.25];

// --- Old skill keys (v1) for migration detection ---

const OLD_SKILL_KEYS = new Set([
  "speed", "strength", "technique", "passing", "dribbling",
  "heading", "defending", "positioning", "finishing", "stamina",
]);

// Mapping from old v1 skills to new EAFC attributes
const OLD_TO_NEW_MAP: Record<string, Record<string, number>> = {
  speed:       { acceleration: 1.0, sprint_speed: 1.0 },
  strength:    { strength: 1.0, aggression: 0.7 },
  technique:   { ball_control: 1.0, dribbling: 0.8 },
  passing:     { short_passing: 1.0, long_passing: 0.8, vision: 0.7 },
  dribbling:   { dribbling: 1.0, agility: 0.8, balance: 0.7 },
  heading:     { heading_accuracy: 1.0, jumping: 0.7 },
  defending:   { stand_tackle: 1.0, slide_tackle: 0.8, def_awareness: 0.9, interceptions: 0.7 },
  positioning: { att_positioning: 0.8, def_awareness: 0.5, composure: 0.7, reactions: 0.6 },
  finishing:   { finishing: 1.0, shot_power: 0.8, volleys: 0.6 },
  stamina:     { stamina: 1.0, aggression: 0.5 },
};

// --- Functions ---

// Keys exclusive to old format (not shared with EAFC)
const OLD_ONLY_KEYS = new Set(
  [...OLD_SKILL_KEYS].filter((k) => !EAFC_ATTRIBUTE_KEYS.includes(k))
);

/**
 * Detects if skills object uses the old v1 format (1-10 scale)
 */
export function isOldSkillsFormat(skills: PlayerSkills): boolean {
  const keys = Object.keys(skills);
  if (keys.length === 0) return false;
  // If any key is exclusively old format, it's v1
  return keys.some((k) => OLD_ONLY_KEYS.has(k));
}

/**
 * Converts old 1-10 skills to EAFC 1-99 format
 */
export function migrateOldSkills(oldSkills: PlayerSkills): PlayerSkills {
  const newSkills: PlayerSkills = {};
  const counts: Record<string, number> = {};

  for (const [oldKey, oldValue] of Object.entries(oldSkills)) {
    const mapping = OLD_TO_NEW_MAP[oldKey];
    if (!mapping) continue;

    // Scale 1-10 → roughly 1-99
    const scaledBase = Math.round(((oldValue - 1) / 9) * 98 + 1);

    for (const [newKey, weight] of Object.entries(mapping)) {
      const contribution = Math.round(scaledBase * weight);
      if (newSkills[newKey] !== undefined) {
        newSkills[newKey] = newSkills[newKey] + contribution;
        counts[newKey] = (counts[newKey] ?? 1) + 1;
      } else {
        newSkills[newKey] = contribution;
        counts[newKey] = 1;
      }
    }
  }

  // Average out multiple contributions and clamp
  for (const key of Object.keys(newSkills)) {
    if (counts[key] > 1) {
      newSkills[key] = Math.round(newSkills[key] / counts[key]);
    }
    newSkills[key] = Math.max(1, Math.min(99, newSkills[key]));
  }

  return newSkills;
}

/**
 * Ensures skills are in EAFC format, migrating if needed
 */
export function ensureEafcFormat(skills: PlayerSkills | null | undefined): PlayerSkills {
  if (!skills || Object.keys(skills).length === 0) return {};
  if (isOldSkillsFormat(skills)) return migrateOldSkills(skills);
  return skills;
}

/**
 * Calculate the average of attributes in a category (1-99)
 */
export function calculateCategoryAverage(
  skills: PlayerSkills,
  category: AttributeCategory
): number {
  const values = category.attributes.map((a) => skills[a.key] ?? 50);
  if (values.length === 0) return 50;
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
}

/**
 * Calculate the 6 category stats (PAC, SHO, PAS, DRI, DEF, PHY)
 */
export function calculateSixStats(skills: PlayerSkills): SixStats {
  const cats = EAFC_ATTRIBUTE_CATEGORIES;
  return {
    pac: calculateCategoryAverage(skills, cats[0]),
    sho: calculateCategoryAverage(skills, cats[1]),
    pas: calculateCategoryAverage(skills, cats[2]),
    dri: calculateCategoryAverage(skills, cats[3]),
    def: calculateCategoryAverage(skills, cats[4]),
    phy: calculateCategoryAverage(skills, cats[5]),
  };
}

/**
 * Calculate overall rating based on position-specific weightings
 */
export function calculateOverallRating(
  skills: PlayerSkills,
  position?: string | null
): number {
  const stats = calculateSixStats(skills);
  const w: SixWeights = (position ? POSITION_WEIGHTS[position] : undefined) ?? DEFAULT_WEIGHTS;

  const weighted =
    stats.pac * w[0] +
    stats.sho * w[1] +
    stats.pas * w[2] +
    stats.dri * w[3] +
    stats.def * w[4] +
    stats.phy * w[5];

  return Math.max(1, Math.min(99, Math.round(weighted)));
}

/**
 * Determine card tier based on overall rating
 */
export function getCardTier(overall: number): CardTier {
  if (overall >= 85) return "gold";
  if (overall >= 70) return "silver";
  return "bronze";
}

/**
 * Check if a skills object has any EAFC attributes set (not just empty)
 */
export function hasEafcSkills(skills: PlayerSkills | null | undefined): boolean {
  if (!skills) return false;
  const eafcSkills = ensureEafcFormat(skills);
  return Object.keys(eafcSkills).length > 0;
}
