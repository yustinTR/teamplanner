import { describe, expect, it } from "vitest";
import { buildSeasonReview } from "@/lib/season-review";

const summary = { played: 8, wins: 5, draws: 1, losses: 2, goalsFor: 21, goalsAgainst: 11 };
const stat = (playerName: string, goals: number, assists: number) => ({
  playerId: playerName,
  playerName,
  matchesPlayed: 8,
  totalMinutes: 300,
  averageMinutes: 38,
  goals,
  assists,
  yellowCards: 0,
  redCards: 0,
});
const att = (playerName: string, respondedCount: number, availableRate: number) => ({
  playerId: playerName,
  playerName,
  respondedCount,
  availableCount: 0,
  responseRate: 0,
  availableRate,
});

describe("buildSeasonReview", () => {
  it("takes the top three scorers and leaves out players without goals", () => {
    const review = buildSeasonReview(
      summary,
      [stat("Sem", 0, 1), stat("Lucas", 7, 2), stat("Finn", 3, 4), stat("Noah", 3, 0), stat("Bram", 1, 0)],
      []
    );
    expect(review.topScorers).toEqual([
      { name: "Lucas", value: 7 },
      { name: "Finn", value: 3 },
      { name: "Noah", value: 3 },
    ]);
    expect(review.topAssists[0]).toEqual({ name: "Finn", value: 4 });
  });

  it("ignores attendance of players who rarely answered", () => {
    const review = buildSeasonReview(summary, [], [att("Daan", 8, 88), att("Jesse", 1, 100), att("Luuk", 6, 75)]);
    expect(review.bestAttendance.map((e) => e.name)).toEqual(["Daan", "Luuk"]);
  });

  it("returns empty lists when there is nothing to show", () => {
    const review = buildSeasonReview(summary, [], []);
    expect(review.topScorers).toEqual([]);
    expect(review.bestAttendance).toEqual([]);
  });
});
