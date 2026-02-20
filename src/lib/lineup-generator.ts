import type { Player, AvailabilityWithPlayer, LineupPosition, MatchPlayer, SubstitutionPlan, SubstitutionMoment } from "@/types";
import { FORMATIONS, type TeamTypeConfig } from "@/lib/constants";

// --- Match player to Player conversion ---

export function matchPlayerToPlayer(mp: MatchPlayer): Player {
  return {
    id: mp.id,
    team_id: "",
    user_id: null,
    name: mp.name,
    position: mp.position,
    jersey_number: null,
    photo_url: null,
    notes: null,
    is_active: true,
    created_at: mp.created_at,
  };
}

// --- Types ---

export interface SubstituteSuggestion {
  position_label: string;
  player: Player;
  compatibility: "exact" | "related" | "any";
}

export interface GeneratedLineup {
  positions: LineupPosition[];
  substitutes: SubstituteSuggestion[];
  unassigned: Player[];
}

// --- Position category mapping ---

type PositionCategory = "goalkeeper" | "defender" | "midfielder" | "forward";

const LABEL_TO_CATEGORY: Record<string, PositionCategory> = {
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

// Related categories for fallback matching
const RELATED_CATEGORIES: Record<PositionCategory, PositionCategory[]> = {
  goalkeeper: [],
  defender: ["midfielder"],
  midfielder: ["defender", "forward"],
  forward: ["midfielder"],
};

function getCategory(positionLabel: string): PositionCategory | undefined {
  return LABEL_TO_CATEGORY[positionLabel];
}

// --- Main generator ---

export function generateLineup(
  formation: string,
  availablePlayers: Player[],
  availability: AvailabilityWithPlayer[]
): GeneratedLineup {
  const formationSlots = FORMATIONS[formation] ?? FORMATIONS["4-3-3"];

  // Build availability priority map: available = 0, maybe = 1
  const priorityMap = new Map<string, number>();
  for (const a of availability) {
    if (a.status === "available") {
      priorityMap.set(a.player_id, 0);
    } else if (a.status === "maybe") {
      priorityMap.set(a.player_id, 1);
    }
  }

  // Sort players: available first, then maybe; within same priority, keep original order
  const sortedPlayers = [...availablePlayers].sort((a, b) => {
    const pa = priorityMap.get(a.id) ?? 2;
    const pb = priorityMap.get(b.id) ?? 2;
    return pa - pb;
  });

  // Track remaining pool of players
  const remaining = new Set(sortedPlayers.map((p) => p.id));

  const positions: LineupPosition[] = [];

  // Helper: find best player for a slot category from the remaining pool
  function pickPlayer(
    category: PositionCategory | undefined
  ): Player | undefined {
    if (!category) return pickAnyPlayer();

    // 1. Exact position match
    for (const p of sortedPlayers) {
      if (remaining.has(p.id) && p.position === category) {
        remaining.delete(p.id);
        return p;
      }
    }

    // 2. Player without a position
    for (const p of sortedPlayers) {
      if (remaining.has(p.id) && !p.position) {
        remaining.delete(p.id);
        return p;
      }
    }

    // 3. Related category
    const related = RELATED_CATEGORIES[category] ?? [];
    for (const rel of related) {
      for (const p of sortedPlayers) {
        if (remaining.has(p.id) && p.position === rel) {
          remaining.delete(p.id);
          return p;
        }
      }
    }

    // 4. Any remaining player
    return pickAnyPlayer();
  }

  function pickAnyPlayer(): Player | undefined {
    for (const p of sortedPlayers) {
      if (remaining.has(p.id)) {
        remaining.delete(p.id);
        return p;
      }
    }
    return undefined;
  }

  // Step 1: Fill keeper slot first
  const keeperSlotIndex = formationSlots.findIndex(
    (s) => s.position_label === "K"
  );
  if (keeperSlotIndex >= 0) {
    const slot = formationSlots[keeperSlotIndex];
    const keeper = pickPlayer("goalkeeper");
    if (keeper) {
      positions.push({
        player_id: keeper.id,
        x: slot.x,
        y: slot.y,
        position_label: slot.position_label,
      });
    }
  }

  // Step 2: Fill remaining slots
  for (let i = 0; i < formationSlots.length; i++) {
    if (i === keeperSlotIndex) continue; // Already filled
    const slot = formationSlots[i];
    const category = getCategory(slot.position_label);
    const player = pickPlayer(category);
    if (player) {
      positions.push({
        player_id: player.id,
        x: slot.x,
        y: slot.y,
        position_label: slot.position_label,
      });
    }
  }

  // Step 3: Generate substitute suggestions from remaining players
  const remainingPlayers = sortedPlayers.filter((p) => remaining.has(p.id));
  const substitutes: SubstituteSuggestion[] = [];

  for (const player of remainingPlayers) {
    // Find the best position match for this substitute
    let bestLabel: string | undefined;
    let bestCompat: SubstituteSuggestion["compatibility"] = "any";

    for (const slot of formationSlots) {
      const slotCategory = getCategory(slot.position_label);
      if (!slotCategory) continue;

      if (player.position === slotCategory) {
        bestLabel = slot.position_label;
        bestCompat = "exact";
        break;
      }

      if (
        !bestLabel &&
        player.position &&
        RELATED_CATEGORIES[slotCategory]?.includes(
          player.position as PositionCategory
        )
      ) {
        bestLabel = slot.position_label;
        bestCompat = "related";
      }
    }

    substitutes.push({
      position_label: bestLabel ?? formationSlots[0]?.position_label ?? "K",
      player,
      compatibility: bestCompat,
    });
  }

  // Sort substitutes: exact > related > any
  const compatOrder = { exact: 0, related: 1, any: 2 };
  substitutes.sort(
    (a, b) => compatOrder[a.compatibility] - compatOrder[b.compatibility]
  );

  return {
    positions,
    substitutes,
    unassigned: [],
  };
}

// --- Substitution Plan Generator ---

export interface GeneratedLineupWithSubs extends GeneratedLineup {
  substitutionPlan: SubstitutionPlan | null;
}

export function generateSubstitutionPlan(
  formation: string,
  availablePlayers: Player[],
  availability: AvailabilityWithPlayer[],
  teamTypeConfig: TeamTypeConfig
): GeneratedLineupWithSubs {
  const baseLineup = generateLineup(formation, availablePlayers, availability);
  const formationSlots = FORMATIONS[formation] ?? FORMATIONS["4-3-3"];
  const fieldSlots = formationSlots.length;
  const totalPlayers = availablePlayers.length;

  // If not enough players for substitutions, no plan needed
  if (totalPlayers <= fieldSlots) {
    return { ...baseLineup, substitutionPlan: null };
  }

  const totalMinutes = teamTypeConfig.halfMinutes * teamTypeConfig.halves;
  const benchSize = totalPlayers - fieldSlots;

  // Determine number of substitution moments
  const isGTeam = teamTypeConfig.fieldPlayers <= 7;
  const maxMoments = isGTeam ? Math.floor(totalMinutes / 8) : Math.floor(totalMinutes / 10);
  const numMoments = Math.min(Math.ceil(totalPlayers / benchSize) - 1, maxMoments, 6);

  if (numMoments <= 0) {
    return { ...baseLineup, substitutionPlan: null };
  }

  // Calculate substitution times, evenly spread, avoiding first/last 5 min
  const safeStart = 5;
  const safeEnd = totalMinutes - 5;
  const safeRange = safeEnd - safeStart;
  const interval = safeRange / (numMoments + 1);

  const subTimes: number[] = [];
  for (let i = 1; i <= numMoments; i++) {
    subTimes.push(Math.round(safeStart + interval * i));
  }

  // Build player name map
  const playerNameMap = new Map(availablePlayers.map((p) => [p.id, p.name]));

  // Identify keepers and field players
  const keeperSlot = formationSlots.find((s) => s.position_label === "K");
  const startingKeepers: string[] = [];
  const fieldPlayerIds: string[] = [];

  for (const pos of baseLineup.positions) {
    if (keeperSlot && pos.x === keeperSlot.x && pos.y === keeperSlot.y) {
      startingKeepers.push(pos.player_id);
    } else {
      fieldPlayerIds.push(pos.player_id);
    }
  }

  // Check if there are multiple keepers (goalkeeper position)
  const multipleKeepers = availablePlayers.filter((p) => p.position === "goalkeeper").length >= 2;

  // Build the full rotation pool (exclude keeper unless multiple keepers)
  const rotatingPlayers: string[] = multipleKeepers
    ? [...fieldPlayerIds, ...startingKeepers, ...baseLineup.substitutes.map((s) => s.player.id)]
    : [...fieldPlayerIds, ...baseLineup.substitutes.map((s) => s.player.id)];

  const fixedKeeper = multipleKeepers ? null : startingKeepers[0];

  // Track who is currently on the field
  const currentField = new Set(baseLineup.positions.map((p) => p.player_id));
  const currentBench = new Set(
    baseLineup.substitutes.map((s) => s.player.id)
  );
  if (!multipleKeepers && fixedKeeper) {
    // Keep keeper out of rotation tracking, always on field
  }

  // Position map: player_id -> position_label they're currently playing
  const playerPositionMap = new Map<string, string>();
  for (const pos of baseLineup.positions) {
    playerPositionMap.set(pos.player_id, pos.position_label);
  }

  // Track playing time periods
  const playerPeriods = new Map<string, { start: number; end: number }[]>();
  for (const pid of availablePlayers.map((p) => p.id)) {
    if (currentField.has(pid)) {
      playerPeriods.set(pid, [{ start: 0, end: -1 }]); // -1 means ongoing
    } else {
      playerPeriods.set(pid, []);
    }
  }

  const substitutionMoments: SubstitutionMoment[] = [];

  // Round-robin rotation
  const benchQueue = [...baseLineup.substitutes.map((s) => s.player.id)];

  for (const minute of subTimes) {
    const outsThisMoment: SubstitutionMoment["out"] = [];
    const insThisMoment: SubstitutionMoment["in"] = [];

    // Determine how many subs this moment
    const subsCount = Math.min(benchQueue.length, Math.max(1, Math.ceil(benchSize / numMoments)));

    for (let i = 0; i < subsCount; i++) {
      if (benchQueue.length === 0) break;

      const playerIn = benchQueue.shift()!;

      // Find who to take out — pick the field player who has played most continuously
      // Exclude keeper if not rotating
      const candidatesOut = rotatingPlayers.filter(
        (pid) => currentField.has(pid) && pid !== playerIn && (multipleKeepers || pid !== fixedKeeper)
      );

      if (candidatesOut.length === 0) break;

      // Pick the player who started earliest in current stint
      let bestOut = candidatesOut[0];
      let bestStintStart = Infinity;
      for (const cid of candidatesOut) {
        const periods = playerPeriods.get(cid) ?? [];
        const lastPeriod = periods[periods.length - 1];
        if (lastPeriod && lastPeriod.end === -1 && lastPeriod.start < bestStintStart) {
          bestStintStart = lastPeriod.start;
          bestOut = cid;
        }
      }

      const outPosition = playerPositionMap.get(bestOut) ?? "?";

      outsThisMoment.push({
        player_id: bestOut,
        name: playerNameMap.get(bestOut) ?? "?",
        position_label: outPosition,
      });
      insThisMoment.push({
        player_id: playerIn,
        name: playerNameMap.get(playerIn) ?? "?",
        position_label: outPosition,
      });

      // Update tracking
      currentField.delete(bestOut);
      currentField.add(playerIn);
      currentBench.delete(playerIn);
      currentBench.add(bestOut);

      // Close the period for the player going out
      const outPeriods = playerPeriods.get(bestOut) ?? [];
      const lastOut = outPeriods[outPeriods.length - 1];
      if (lastOut && lastOut.end === -1) lastOut.end = minute;

      // Start new period for player coming in
      const inPeriods = playerPeriods.get(playerIn) ?? [];
      inPeriods.push({ start: minute, end: -1 });
      playerPeriods.set(playerIn, inPeriods);

      // Update position map
      playerPositionMap.delete(bestOut);
      playerPositionMap.set(playerIn, outPosition);

      // Put the outgoing player at end of bench queue
      benchQueue.push(bestOut);
    }

    if (outsThisMoment.length > 0) {
      substitutionMoments.push({
        minute,
        out: outsThisMoment,
        in: insThisMoment,
      });
    }
  }

  // Close all open periods at full time
  for (const [, periods] of playerPeriods) {
    const last = periods[periods.length - 1];
    if (last && last.end === -1) last.end = totalMinutes;
  }

  // Calculate player minutes
  const playerMinutes = availablePlayers.map((p) => {
    const periods = playerPeriods.get(p.id) ?? [];
    const total = periods.reduce((sum, period) => sum + (period.end - period.start), 0);
    return {
      player_id: p.id,
      name: p.name,
      totalMinutes: total,
      percentage: Math.round((total / totalMinutes) * 100),
      periods,
    };
  });

  // Sort by total minutes ascending so coaches see who plays least first
  playerMinutes.sort((a, b) => a.totalMinutes - b.totalMinutes);

  return {
    ...baseLineup,
    substitutionPlan: {
      teamType: teamTypeConfig.label,
      totalMinutes,
      substitutionMoments,
      playerMinutes,
    },
  };
}
