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

interface LineupTextContext {
  opponent: string;
  /** ISO date-time of the match. */
  matchDate: string;
}

/**
 * Plain-text lineup for a group chat: keeper, lines from defence to attack,
 * bench and substitution moments. Lines are grouped by height on the pitch
 * so any formation reads the same way.
 */
export function lineupAsText(data: ShareLineupData, { opponent, matchDate }: LineupTextContext): string {
  const date = new Date(matchDate);
  const when = `${date.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" })} · ${date.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}`;

  const keeper = data.players.filter((p) => p.positionLabel === "K");
  const field = data.players.filter((p) => p.positionLabel !== "K");
  const band = (y: number) => (y >= 62 ? "Verdediging" : y >= 35 ? "Middenveld" : "Aanval");
  const lines = new Map<string, string[]>();
  for (const p of [...field].sort((a, b) => b.y - a.y || a.x - b.x)) {
    const key = band(p.y);
    lines.set(key, [...(lines.get(key) ?? []), p.name]);
  }

  const out = [`Opstelling vs. ${opponent}`, `${when} · ${data.formation}`, ""];
  if (keeper.length) out.push(`Keeper: ${keeper.map((p) => p.name).join(", ")}`);
  for (const key of ["Verdediging", "Middenveld", "Aanval"]) {
    const names = lines.get(key);
    if (names) out.push(`${key}: ${names.join(", ")}`);
  }
  if (data.benchNames.length) out.push(`Bank: ${data.benchNames.join(", ")}`);

  const moments = data.substitutionPlan?.substitutionMoments ?? [];
  if (moments.length) {
    out.push("", "Wissels:");
    for (const m of moments) {
      const swaps = m.out.map((o, i) => `${m.in[i]?.name ?? "?"} voor ${o.name}`).join(", ");
      out.push(`${m.minute}': ${swaps}`);
    }
  }
  out.push("", "Gemaakt met MyTeamPlanner — myteamplanner.nl/maak");
  return out.join("\n");
}
