import { FORMATIONS_11, FORMATIONS_8, FORMATIONS_7, FORMATIONS_6 } from "@/lib/constants";
import type { LineupPosition, SubstitutionPlan } from "@/types";

/** Match formats offered by the public tools, following the KNVB rules. */
export interface MatchFormat {
  key: string;
  label: string;
  /** Players on the pitch, keeper included. */
  onPitch: number;
  totalMinutes: number;
  formation: string;
}

export const MATCH_FORMATS: MatchFormat[] = [
  { key: "senioren", label: "Senioren · 11 tegen 11 · 2x45", onPitch: 11, totalMinutes: 90, formation: "4-3-3" },
  { key: "jo19_jo17", label: "JO19–JO17 · 11 tegen 11 · 2x40", onPitch: 11, totalMinutes: 80, formation: "4-3-3" },
  { key: "jo15_jo14", label: "JO15–JO14 · 11 tegen 11 · 2x35", onPitch: 11, totalMinutes: 70, formation: "4-3-3" },
  { key: "jo13", label: "JO13 · 11 tegen 11 · 2x30", onPitch: 11, totalMinutes: 60, formation: "4-3-3" },
  { key: "jo12_jo11", label: "JO12–JO11 · 8 tegen 8 · 2x30", onPitch: 8, totalMinutes: 60, formation: "3-3-1" },
  { key: "jo10", label: "JO10 · 6 tegen 6 · 2x25", onPitch: 6, totalMinutes: 50, formation: "2-2-1" },
  { key: "jo9_jo8", label: "JO9–JO8 · 6 tegen 6 · 2x20", onPitch: 6, totalMinutes: 40, formation: "2-2-1" },
  { key: "7x7", label: "7 tegen 7 (7x7, toernooi) · 2x25", onPitch: 7, totalMinutes: 50, formation: "2-3-1" },
];

export function formationPositions(format: MatchFormat): Omit<LineupPosition, "player_id">[] {
  const sets = { 11: FORMATIONS_11, 8: FORMATIONS_8, 7: FORMATIONS_7, 6: FORMATIONS_6 } as const;
  const set = sets[format.onPitch as keyof typeof sets];
  return set[format.formation] ?? Object.values(set)[0];
}

export interface FairScheduleInput {
  /** All players; the first one is the keeper and plays the whole match. */
  players: string[];
  format: MatchFormat;
  /** Number of equal periods. Omit to pick the fairest count up to 6. */
  periods?: number;
}

export interface FairSchedule {
  plan: SubstitutionPlan;
  /** Who starts where, keeper first, in formation order. */
  starters: { name: string; positionLabel: string; x: number; y: number }[];
  bench: string[];
  /** Largest minus smallest outfield playing time. */
  spread: number;
}

/**
 * Rotating bench: the outfield players form a queue and each period the
 * next `benchSize` players sit out, so bench turns differ by at most one.
 * A player coming on takes the position of the player going off.
 */
export function buildFairSchedule({ players, format, periods }: FairScheduleInput): FairSchedule {
  const positions = formationPositions(format);
  const [keeper, ...outfield] = players;
  const slots = format.onPitch - 1;
  const benchSize = Math.max(0, outfield.length - slots);
  const periodCount = benchSize === 0 ? 1 : (periods ?? pickPeriods(outfield.length, benchSize, format.totalMinutes));
  const boundaries = Array.from({ length: periodCount + 1 }, (_, i) =>
    Math.round((format.totalMinutes * i) / periodCount)
  );

  // Bench per period: period 0 benches the last players, then the queue moves on.
  const benchOf = (period: number): Set<string> => {
    const set = new Set<string>();
    for (let i = 0; i < benchSize; i++) {
      const index = (outfield.length - benchSize + period * benchSize + i) % outfield.length;
      set.add(outfield[index]);
    }
    return set;
  };

  const startingOutfield = outfield.filter((name) => !benchOf(0).has(name)).slice(0, slots);
  const slotOf = new Map<string, number>();
  startingOutfield.forEach((name, i) => slotOf.set(name, i + 1));

  const moments: SubstitutionPlan["substitutionMoments"] = [];
  for (let period = 1; period < periodCount; period++) {
    const before = benchOf(period - 1);
    const now = benchOf(period);
    const goingOff = outfield.filter((n) => now.has(n) && !before.has(n));
    const comingOn = outfield.filter((n) => before.has(n) && !now.has(n));
    const moment = { minute: boundaries[period], out: [] as typeof moments[number]["out"], in: [] as typeof moments[number]["in"] };
    goingOff.forEach((offName, i) => {
      const onName = comingOn[i];
      const slot = slotOf.get(offName)!;
      const label = positions[slot].position_label;
      slotOf.delete(offName);
      slotOf.set(onName, slot);
      moment.out.push({ player_id: offName, name: offName, position_label: label });
      moment.in.push({ player_id: onName, name: onName, position_label: label });
    });
    moments.push(moment);
  }

  const playerMinutes = [keeper, ...outfield].map((name) => {
    const periodsOn: { start: number; end: number }[] = [];
    for (let period = 0; period < periodCount; period++) {
      const on = name === keeper || !benchOf(period).has(name);
      if (!on) continue;
      const start = boundaries[period];
      const end = boundaries[period + 1];
      const last = periodsOn[periodsOn.length - 1];
      if (last && last.end === start) last.end = end;
      else periodsOn.push({ start, end });
    }
    const total = periodsOn.reduce((sum, r) => sum + (r.end - r.start), 0);
    return {
      player_id: name,
      name,
      totalMinutes: total,
      percentage: Math.round((total / format.totalMinutes) * 100),
      periods: periodsOn,
    };
  });

  const outfieldMinutes = playerMinutes.slice(1).map((p) => p.totalMinutes);
  const spread = outfieldMinutes.length ? Math.max(...outfieldMinutes) - Math.min(...outfieldMinutes) : 0;

  const starters = [keeper, ...startingOutfield].map((name, i) => ({
    name,
    positionLabel: positions[i].position_label,
    x: positions[i].x,
    y: positions[i].y,
  }));

  return {
    plan: {
      teamType: format.label,
      totalMinutes: format.totalMinutes,
      substitutionMoments: moments,
      playerMinutes,
    },
    starters,
    bench: [...benchOf(0)],
    spread,
  };
}

/**
 * Period count (2–6) balancing fairness against the number of substitution
 * moments: every extra period costs two minutes of spread, because a coach
 * on the touchline prefers fewer moments over a near-identical schedule.
 */
function pickPeriods(outfieldCount: number, benchSize: number, totalMinutes: number): number {
  const COST_PER_EXTRA_PERIOD = 2;
  let best = 2;
  let bestScore = Infinity;
  for (let p = 2; p <= 6; p++) {
    const uneven = (p * benchSize) % outfieldCount === 0 ? 0 : 1;
    const score = uneven * (totalMinutes / p) + (p - 2) * COST_PER_EXTRA_PERIOD;
    if (score < bestScore - 0.01) {
      best = p;
      bestScore = score;
    }
  }
  return best;
}
