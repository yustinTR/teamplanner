import { FORMATIONS, type PlayerSkills } from "@/lib/constants";
import {
  calculateOverallRating,
  ensureEafcFormat,
  getCardTier,
  hasEafcSkills,
  type CardTier,
} from "@/lib/player-rating";
import { matchPlayerToPlayer } from "@/lib/lineup-generator";
import type {
  AvailabilityWithPlayer,
  Lineup,
  LineupPosition,
  MatchPlayer,
  Player,
  SubstitutionPlan,
} from "@/types";

export interface ShareLineupPlayer {
  name: string;
  positionLabel: string;
  x: number;
  y: number;
  overall: number | null;
  cardTier: CardTier | null;
}

export interface ShareLineupData {
  formation: string;
  players: ShareLineupPlayer[];
  benchNames: string[];
  substitutionPlan: SubstitutionPlan | null;
}

interface BuildShareLineupInput {
  lineup: Lineup | null | undefined;
  players: Player[] | undefined;
  matchPlayers: MatchPlayer[] | undefined;
  availability: AvailabilityWithPlayer[] | undefined;
  showRatings: boolean;
}

/** Positions of a saved lineup, or an empty list when nothing is saved. */
export function lineupPositions(lineup: Lineup | null | undefined): LineupPosition[] {
  return (lineup?.positions as unknown as LineupPosition[] | null) ?? [];
}

/**
 * Turns a saved lineup plus team data into the props of ShareLineupCard.
 * Returns null when the lineup has no placed players.
 */
export function buildShareLineupData({
  lineup,
  players,
  matchPlayers,
  availability,
  showRatings,
}: BuildShareLineupInput): ShareLineupData | null {
  const positions = lineupPositions(lineup);
  if (!lineup || positions.length === 0) return null;

  const formation = lineup.formation ?? "4-3-3";
  const formationSlots = FORMATIONS[formation] ?? FORMATIONS["4-3-3"];
  const allPlayers = [
    ...(players ?? []),
    ...(matchPlayers ?? []).map(matchPlayerToPlayer),
  ];
  const playerMap = new Map(allPlayers.map((p) => [p.id, p]));
  const placedIds = new Set(positions.map((p) => p.player_id));

  const sharePlayers = positions.map((pos) => {
    const player = playerMap.get(pos.player_id);
    const slot = formationSlots.find((s) => s.x === pos.x && s.y === pos.y);
    const positionLabel = slot?.position_label ?? "";
    let overall: number | null = null;
    let cardTier: CardTier | null = null;
    if (showRatings && player) {
      const rawSkills = (player.skills as PlayerSkills) ?? {};
      if (hasEafcSkills(rawSkills)) {
        overall = calculateOverallRating(ensureEafcFormat(rawSkills), positionLabel);
        cardTier = getCardTier(overall);
      }
    }
    return { name: player?.name ?? "?", positionLabel, x: pos.x, y: pos.y, overall, cardTier };
  });

  const benchNames = (availability ?? [])
    .filter((a) => a.status === "available" && !placedIds.has(a.player_id))
    .map((a) => a.players?.name)
    .filter((name): name is string => !!name);

  return {
    formation,
    players: sharePlayers,
    benchNames,
    substitutionPlan: (lineup.substitution_plan as unknown as SubstitutionPlan | null) ?? null,
  };
}
