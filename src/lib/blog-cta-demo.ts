import type { SubstitutionPlan } from "@/types";

/**
 * Example data for the share-card previews in blog CTAs: a 7v7 youth team,
 * 2x25 minutes, nine players. 350 playing minutes, everyone outfield plays
 * 37 or 38 of them, so the preview demonstrates fair playing time.
 */
export const DEMO_TEAM = "JO11-1";
export const DEMO_OPPONENT = "VV De Zwaluwen JO11-2";
export const DEMO_MATCH_DATE = "2026-11-14T09:30:00";
export const DEMO_FORMATION = "2-3-1";

export const demoSubstitutionPlan: SubstitutionPlan = {
  teamType: "Jeugd",
  totalMinutes: 50,
  substitutionMoments: [
    {
      minute: 12,
      out: [
        { player_id: "daan", name: "Daan", position_label: "CB" },
        { player_id: "finn", name: "Finn", position_label: "LM" },
      ],
      in: [
        { player_id: "bram", name: "Bram", position_label: "CB" },
        { player_id: "jesse", name: "Jesse", position_label: "LM" },
      ],
    },
    {
      minute: 25,
      out: [
        { player_id: "luuk", name: "Luuk", position_label: "CB" },
        { player_id: "noah", name: "Noah", position_label: "CM" },
      ],
      in: [
        { player_id: "daan", name: "Daan", position_label: "CB" },
        { player_id: "finn", name: "Finn", position_label: "CM" },
      ],
    },
    {
      minute: 37,
      out: [
        { player_id: "milan", name: "Milan", position_label: "RM" },
        { player_id: "lucas", name: "Lucas", position_label: "ST" },
      ],
      in: [
        { player_id: "luuk", name: "Luuk", position_label: "RM" },
        { player_id: "noah", name: "Noah", position_label: "ST" },
      ],
    },
  ],
  playerMinutes: [
    { player_id: "sem", name: "Sem", totalMinutes: 50, percentage: 100, periods: [{ start: 0, end: 50 }] },
    { player_id: "luuk", name: "Luuk", totalMinutes: 38, percentage: 76, periods: [{ start: 0, end: 25 }, { start: 37, end: 50 }] },
    { player_id: "noah", name: "Noah", totalMinutes: 38, percentage: 76, periods: [{ start: 0, end: 25 }, { start: 37, end: 50 }] },
    { player_id: "bram", name: "Bram", totalMinutes: 38, percentage: 76, periods: [{ start: 12, end: 50 }] },
    { player_id: "jesse", name: "Jesse", totalMinutes: 38, percentage: 76, periods: [{ start: 12, end: 50 }] },
    { player_id: "daan", name: "Daan", totalMinutes: 37, percentage: 74, periods: [{ start: 0, end: 12 }, { start: 25, end: 50 }] },
    { player_id: "finn", name: "Finn", totalMinutes: 37, percentage: 74, periods: [{ start: 0, end: 12 }, { start: 25, end: 50 }] },
    { player_id: "milan", name: "Milan", totalMinutes: 37, percentage: 74, periods: [{ start: 0, end: 37 }] },
    { player_id: "lucas", name: "Lucas", totalMinutes: 37, percentage: 74, periods: [{ start: 0, end: 37 }] },
  ],
};

export const demoLineupPlayers = [
  { name: "Sem", positionLabel: "K", x: 50, y: 92 },
  { name: "Daan", positionLabel: "CB", x: 30, y: 72 },
  { name: "Luuk", positionLabel: "CB", x: 70, y: 72 },
  { name: "Finn", positionLabel: "LM", x: 20, y: 48 },
  { name: "Noah", positionLabel: "CM", x: 50, y: 45 },
  { name: "Milan", positionLabel: "RM", x: 80, y: 48 },
  { name: "Lucas", positionLabel: "ST", x: 50, y: 20 },
];

export const demoBench = ["Bram", "Jesse"];

export const demoLineupSubstitutions = demoSubstitutionPlan.substitutionMoments.map((moment) => ({
  minute: moment.minute,
  changes: moment.out.map((out, i) => ({
    outName: out.name,
    inName: moment.in[i].name,
    position: moment.in[i].position_label,
  })),
}));
