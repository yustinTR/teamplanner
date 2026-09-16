import { describe, it, expect } from "vitest";
import {
  aggregateAttendance,
  aggregateTeamResults,
} from "../player-stats-utils";

const players = [
  { id: "p1", name: "Anna" },
  { id: "p2", name: "Bas" },
];

describe("aggregateAttendance", () => {
  it("counts responses and availability per player", () => {
    const availability = [
      { player_id: "p1", match_id: "m1", status: "available" as const },
      { player_id: "p1", match_id: "m2", status: "unavailable" as const },
      { player_id: "p1", match_id: "m3", status: "maybe" as const },
      { player_id: "p2", match_id: "m1", status: "available" as const },
    ];

    const result = aggregateAttendance(players, availability, 4);

    expect(result[0]).toEqual({
      playerId: "p1",
      playerName: "Anna",
      respondedCount: 3,
      availableCount: 1,
      responseRate: 75,
      availableRate: 25,
    });
    expect(result[1].respondedCount).toBe(1);
    expect(result[1].responseRate).toBe(25);
  });

  it("scores a silent player 0 on both rates", () => {
    const result = aggregateAttendance(players, [], 5);
    expect(result[0].responseRate).toBe(0);
    expect(result[0].availableRate).toBe(0);
  });

  it("handles zero matches without dividing by zero", () => {
    const result = aggregateAttendance(players, [], 0);
    expect(result[0].responseRate).toBe(0);
  });
});

describe("aggregateTeamResults", () => {
  it("aggregates wins, draws, losses and goals from the team's perspective", () => {
    const result = aggregateTeamResults([
      { home_away: "home", score_home: 3, score_away: 1 }, // win
      { home_away: "away", score_home: 2, score_away: 2 }, // draw
      { home_away: "away", score_home: 4, score_away: 0 }, // loss (we are away)
      { home_away: "home", score_home: 1, score_away: 2 }, // loss
    ]);

    expect(result).toEqual({
      played: 4,
      wins: 1,
      draws: 1,
      losses: 2,
      goalsFor: 6,
      goalsAgainst: 9,
    });
  });

  it("skips matches without a score", () => {
    const result = aggregateTeamResults([
      { home_away: "home", score_home: null, score_away: null },
      { home_away: "home", score_home: 2, score_away: 0 },
    ]);

    expect(result.played).toBe(1);
    expect(result.wins).toBe(1);
  });

  it("returns zeros for an empty season", () => {
    expect(aggregateTeamResults([])).toEqual({
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    });
  });
});
