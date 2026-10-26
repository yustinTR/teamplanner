import { describe, it, expect } from "vitest";
import { buildShareLineupData, lineupPositions } from "../share-lineup";
import type { AvailabilityWithPlayer, Lineup, Player } from "@/types";

const player = (id: string, name: string, skills: Player["skills"] = null): Player =>
  ({
    id,
    name,
    team_id: "t1",
    skills,
    is_active: true,
    user_id: null,
    jersey_number: null,
    photo_url: null,
    primary_position: "CM",
    detailed_position: null,
    role: "player",
    is_admin: false,
    created_at: "2026-01-01T00:00:00Z",
  }) as unknown as Player;

const lineup = (overrides: Partial<Lineup> = {}): Lineup =>
  ({
    id: "l1",
    match_id: "m1",
    formation: "4-3-3",
    positions: [
      { player_id: "p1", x: 50, y: 92, position_label: "K" },
      { player_id: "p2", x: 50, y: 20, position_label: "ST" },
    ],
    substitution_plan: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  }) as unknown as Lineup;

describe("lineupPositions", () => {
  it("is empty for a missing lineup", () => {
    expect(lineupPositions(null)).toEqual([]);
    expect(lineupPositions(lineup({ positions: null }))).toEqual([]);
  });
});

describe("buildShareLineupData", () => {
  it("returns null without placed players", () => {
    expect(
      buildShareLineupData({
        lineup: lineup({ positions: [] }),
        players: [],
        matchPlayers: [],
        availability: [],
        showRatings: true,
      })
    ).toBeNull();
  });

  it("maps positions to named players with formation labels", () => {
    const data = buildShareLineupData({
      lineup: lineup(),
      players: [player("p1", "Jan"), player("p2", "Piet")],
      matchPlayers: [],
      availability: [],
      showRatings: true,
    });
    expect(data?.formation).toBe("4-3-3");
    expect(data?.players.map((p) => p.name)).toEqual(["Jan", "Piet"]);
    expect(data?.players[0].positionLabel).toBe("K");
    expect(data?.players[0].overall).toBeNull();
  });

  it("uses '?' for unknown players and keeps bench from availability", () => {
    const availability = [
      { player_id: "p3", status: "available", players: { name: "Kees" } },
      { player_id: "p1", status: "available", players: { name: "Jan" } },
      { player_id: "p4", status: "unavailable", players: { name: "Henk" } },
    ] as unknown as AvailabilityWithPlayer[];
    const data = buildShareLineupData({
      lineup: lineup(),
      players: [player("p1", "Jan")],
      matchPlayers: [],
      availability,
      showRatings: false,
    });
    expect(data?.players[1].name).toBe("?");
    expect(data?.benchNames).toEqual(["Kees"]);
  });

  it("rates players only when ratings are shown", () => {
    const skills = {
      pace: 70, shooting: 70, passing: 70, dribbling: 70, defending: 70, physical: 70,
    } as unknown as Player["skills"];
    const withRatings = buildShareLineupData({
      lineup: lineup(),
      players: [player("p1", "Jan", skills), player("p2", "Piet", skills)],
      matchPlayers: [],
      availability: [],
      showRatings: true,
    });
    const withoutRatings = buildShareLineupData({
      lineup: lineup(),
      players: [player("p1", "Jan", skills), player("p2", "Piet", skills)],
      matchPlayers: [],
      availability: [],
      showRatings: false,
    });
    expect(withRatings?.players[1].overall).toBeTypeOf("number");
    expect(withRatings?.players[1].cardTier).not.toBeNull();
    expect(withoutRatings?.players[1].overall).toBeNull();
  });
});
