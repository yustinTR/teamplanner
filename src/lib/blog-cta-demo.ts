import type { SubstitutionPlan } from "@/types";

/**
 * Example data for the share-card previews in blog CTAs and the worked
 * example in the substitution-schedule article: a JO11 team playing the
 * KNVB format, 8 v 8 for 2x30 minutes, with ten players. 420 outfield
 * minutes over nine outfield players: eight play 48, one plays 36.
 */
export const DEMO_TEAM = "JO11-1";
export const DEMO_OPPONENT = "VV De Zwaluwen JO11-2";
export const DEMO_MATCH_DATE = "2026-11-14T09:30:00";
export const DEMO_FORMATION = "3-3-1";

const p = (player_id: string, name: string, position_label: string) => ({
  player_id,
  name,
  position_label,
});

export const demoSubstitutionPlan: SubstitutionPlan = {
  teamType: "JO11",
  totalMinutes: 60,
  substitutionMoments: [
    { minute: 12, out: [p("daan", "Daan", "LB"), p("noah", "Noah", "LM")], in: [p("jesse", "Jesse", "LB"), p("thijs", "Thijs", "LM")] },
    { minute: 24, out: [p("luuk", "Luuk", "CB"), p("milan", "Milan", "CM")], in: [p("daan", "Daan", "CB"), p("noah", "Noah", "CM")] },
    { minute: 36, out: [p("finn", "Finn", "RB"), p("lucas", "Lucas", "RM")], in: [p("luuk", "Luuk", "RB"), p("milan", "Milan", "RM")] },
    { minute: 48, out: [p("jesse", "Jesse", "LB"), p("bram", "Bram", "ST")], in: [p("lucas", "Lucas", "LB"), p("finn", "Finn", "ST")] },
  ],
  playerMinutes: [
    { player_id: "sem", name: "Sem", totalMinutes: 60, percentage: 100, periods: [{ start: 0, end: 60 }] },
    { player_id: "bram", name: "Bram", totalMinutes: 48, percentage: 80, periods: [{ start: 0, end: 48 }] },
    { player_id: "thijs", name: "Thijs", totalMinutes: 48, percentage: 80, periods: [{ start: 12, end: 60 }] },
    { player_id: "daan", name: "Daan", totalMinutes: 48, percentage: 80, periods: [{ start: 0, end: 12 }, { start: 24, end: 60 }] },
    { player_id: "noah", name: "Noah", totalMinutes: 48, percentage: 80, periods: [{ start: 0, end: 12 }, { start: 24, end: 60 }] },
    { player_id: "luuk", name: "Luuk", totalMinutes: 48, percentage: 80, periods: [{ start: 0, end: 24 }, { start: 36, end: 60 }] },
    { player_id: "milan", name: "Milan", totalMinutes: 48, percentage: 80, periods: [{ start: 0, end: 24 }, { start: 36, end: 60 }] },
    { player_id: "finn", name: "Finn", totalMinutes: 48, percentage: 80, periods: [{ start: 0, end: 36 }, { start: 48, end: 60 }] },
    { player_id: "lucas", name: "Lucas", totalMinutes: 48, percentage: 80, periods: [{ start: 0, end: 36 }, { start: 48, end: 60 }] },
    { player_id: "jesse", name: "Jesse", totalMinutes: 36, percentage: 60, periods: [{ start: 12, end: 48 }] },
  ],
};

/** Starting eight in a 3-3-1 (8 v 8). */
export const demoLineupPlayers = [
  { name: "Sem", positionLabel: "K", x: 50, y: 92 },
  { name: "Daan", positionLabel: "LB", x: 20, y: 72 },
  { name: "Luuk", positionLabel: "CB", x: 50, y: 75 },
  { name: "Finn", positionLabel: "RB", x: 80, y: 72 },
  { name: "Noah", positionLabel: "LM", x: 20, y: 48 },
  { name: "Milan", positionLabel: "CM", x: 50, y: 45 },
  { name: "Lucas", positionLabel: "RM", x: 80, y: 48 },
  { name: "Bram", positionLabel: "ST", x: 50, y: 20 },
];

export const demoBench = ["Jesse", "Thijs"];

export const demoLineupSubstitutions = demoSubstitutionPlan.substitutionMoments.map((moment) => ({
  minute: moment.minute,
  changes: moment.out.map((out, i) => ({
    outName: out.name,
    inName: moment.in[i].name,
    position: moment.in[i].position_label,
  })),
}));

/** A 7 v 7 lineup (2-3-1) for the 7-a-side article. */
export const DEMO_TEAM_7 = "Zaterdag 7x7";
export const DEMO_OPPONENT_7 = "SV Oost 7x7";
export const DEMO_FORMATION_7 = "2-3-1";
export const demoLineupPlayers7 = [
  { name: "Sem", positionLabel: "K", x: 50, y: 92 },
  { name: "Daan", positionLabel: "CB", x: 30, y: 72 },
  { name: "Luuk", positionLabel: "CB", x: 70, y: 72 },
  { name: "Finn", positionLabel: "LM", x: 20, y: 48 },
  { name: "Noah", positionLabel: "CM", x: 50, y: 45 },
  { name: "Milan", positionLabel: "RM", x: 80, y: 48 },
  { name: "Lucas", positionLabel: "ST", x: 50, y: 20 },
];
export const demoBench7 = ["Bram", "Jesse"];
