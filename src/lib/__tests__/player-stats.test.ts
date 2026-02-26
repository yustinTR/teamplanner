import { describe, it, expect } from "vitest";
import { aggregatePlayerStats, findTopPlayer } from "../player-stats-utils";
import type { SubstitutionPlan } from "@/types/lineup";

function makeLineup(
  matchId: string,
  playerMinutes: SubstitutionPlan["playerMinutes"]
) {
  return {
    match_id: matchId,
    substitution_plan: {
      teamType: "senioren",
      totalMinutes: 90,
      substitutionMoments: [],
      playerMinutes,
    } satisfies SubstitutionPlan,
  };
}

const PLAYERS = [
  { id: "p1", name: "Jan" },
  { id: "p2", name: "Pieter" },
  { id: "p3", name: "Klaas" },
];

describe("aggregatePlayerStats", () => {
  it("returns zero stats when no lineups or match stats exist", () => {
    const result = aggregatePlayerStats(PLAYERS, [], []);
    expect(result).toHaveLength(3);
    for (const r of result) {
      expect(r.matchesPlayed).toBe(0);
      expect(r.totalMinutes).toBe(0);
      expect(r.averageMinutes).toBe(0);
      expect(r.goals).toBe(0);
      expect(r.assists).toBe(0);
      expect(r.yellowCards).toBe(0);
      expect(r.redCards).toBe(0);
    }
  });

  it("calculates playing time from lineup substitution plans", () => {
    const lineups = [
      makeLineup("m1", [
        { player_id: "p1", name: "Jan", totalMinutes: 90, percentage: 100, periods: [{ start: 0, end: 90 }] },
        { player_id: "p2", name: "Pieter", totalMinutes: 45, percentage: 50, periods: [{ start: 45, end: 90 }] },
      ]),
      makeLineup("m2", [
        { player_id: "p1", name: "Jan", totalMinutes: 60, percentage: 67, periods: [{ start: 0, end: 60 }] },
        { player_id: "p2", name: "Pieter", totalMinutes: 90, percentage: 100, periods: [{ start: 0, end: 90 }] },
      ]),
    ];

    const result = aggregatePlayerStats(PLAYERS, lineups, []);

    const jan = result.find((r) => r.playerId === "p1")!;
    expect(jan.matchesPlayed).toBe(2);
    expect(jan.totalMinutes).toBe(150);
    expect(jan.averageMinutes).toBe(75);

    const pieter = result.find((r) => r.playerId === "p2")!;
    expect(pieter.matchesPlayed).toBe(2);
    expect(pieter.totalMinutes).toBe(135);
    expect(pieter.averageMinutes).toBe(68);

    const klaas = result.find((r) => r.playerId === "p3")!;
    expect(klaas.matchesPlayed).toBe(0);
    expect(klaas.totalMinutes).toBe(0);
  });

  it("sums match stats across multiple matches", () => {
    const matchStats = [
      { player_id: "p1", goals: 2, assists: 1, yellow_cards: 0, red_cards: 0 },
      { player_id: "p1", goals: 1, assists: 0, yellow_cards: 1, red_cards: 0 },
      { player_id: "p2", goals: 0, assists: 2, yellow_cards: 0, red_cards: 1 },
    ];

    const result = aggregatePlayerStats(PLAYERS, [], matchStats);

    const jan = result.find((r) => r.playerId === "p1")!;
    expect(jan.goals).toBe(3);
    expect(jan.assists).toBe(1);
    expect(jan.yellowCards).toBe(1);
    expect(jan.redCards).toBe(0);

    const pieter = result.find((r) => r.playerId === "p2")!;
    expect(pieter.goals).toBe(0);
    expect(pieter.assists).toBe(2);
    expect(pieter.redCards).toBe(1);
  });

  it("combines lineup playing time and match stats", () => {
    const lineups = [
      makeLineup("m1", [
        { player_id: "p1", name: "Jan", totalMinutes: 90, percentage: 100, periods: [{ start: 0, end: 90 }] },
      ]),
    ];
    const matchStats = [
      { player_id: "p1", goals: 2, assists: 1, yellow_cards: 1, red_cards: 0 },
    ];

    const result = aggregatePlayerStats(PLAYERS, lineups, matchStats);
    const jan = result.find((r) => r.playerId === "p1")!;

    expect(jan.matchesPlayed).toBe(1);
    expect(jan.totalMinutes).toBe(90);
    expect(jan.averageMinutes).toBe(90);
    expect(jan.goals).toBe(2);
    expect(jan.assists).toBe(1);
    expect(jan.yellowCards).toBe(1);
  });

  it("handles lineups with no substitution plan", () => {
    const lineups = [{ match_id: "m1", substitution_plan: null }];
    const result = aggregatePlayerStats(PLAYERS, lineups, []);

    for (const r of result) {
      expect(r.matchesPlayed).toBe(0);
      expect(r.totalMinutes).toBe(0);
    }
  });

  it("ignores players with 0 minutes in lineup", () => {
    const lineups = [
      makeLineup("m1", [
        { player_id: "p1", name: "Jan", totalMinutes: 0, percentage: 0, periods: [] },
      ]),
    ];

    const result = aggregatePlayerStats(PLAYERS, lineups, []);
    const jan = result.find((r) => r.playerId === "p1")!;
    expect(jan.matchesPlayed).toBe(0);
  });
});

describe("findTopPlayer", () => {
  const stats = [
    {
      playerId: "p1", playerName: "Jan",
      matchesPlayed: 10, totalMinutes: 800, averageMinutes: 80,
      goals: 5, assists: 3, yellowCards: 1, redCards: 0,
    },
    {
      playerId: "p2", playerName: "Pieter",
      matchesPlayed: 12, totalMinutes: 600, averageMinutes: 50,
      goals: 12, assists: 1, yellowCards: 2, redCards: 0,
    },
    {
      playerId: "p3", playerName: "Klaas",
      matchesPlayed: 8, totalMinutes: 900, averageMinutes: 113,
      goals: 0, assists: 8, yellowCards: 0, redCards: 0,
    },
  ];

  it("finds top scorer", () => {
    const top = findTopPlayer(stats, "goals");
    expect(top?.playerId).toBe("p2");
  });

  it("finds player with most minutes", () => {
    const top = findTopPlayer(stats, "totalMinutes");
    expect(top?.playerId).toBe("p3");
  });

  it("finds player with most matches", () => {
    const top = findTopPlayer(stats, "matchesPlayed");
    expect(top?.playerId).toBe("p2");
  });

  it("returns undefined for empty stats", () => {
    expect(findTopPlayer([], "goals")).toBeUndefined();
  });

  it("returns undefined when all players have 0 for the stat", () => {
    const zeroStats = stats.map((s) => ({ ...s, goals: 0 }));
    expect(findTopPlayer(zeroStats, "goals")).toBeUndefined();
  });
});
