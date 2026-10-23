import { describe, it, expect } from "vitest";
import {
  buildAvailabilityReminder,
  buildLineupPublished,
  buildSyncSummary,
  lineupPlayerIds,
  usersWithoutResponse,
} from "../push-messages";
import type { LineupPosition, SubstitutionPlan } from "@/types";

const match = {
  id: "m1",
  teamName: "Be Fair G2",
  opponent: "SEV G3",
  matchDate: "2026-11-07T13:30:00.000Z",
};

describe("push payloads", () => {
  it("builds an availability reminder that links to the match", () => {
    const payload = buildAvailabilityReminder(match);
    expect(payload.title).toBe("Kun je spelen?");
    expect(payload.body).toContain("Be Fair G2 – SEV G3");
    expect(payload.url).toBe("/matches/m1");
    expect(payload.tag).toBe("availability-m1");
  });

  it("builds a lineup notification per match", () => {
    const payload = buildLineupPublished(match);
    expect(payload.title).toBe("Opstelling bekend");
    expect(payload.tag).toBe("lineup-m1");
  });

  it("describes a single sync change and counts several", () => {
    const one = buildSyncSummary("t1", "Be Fair G2", [
      { type: "updated", opponent: "SEV G3", matchDate: match.matchDate },
    ]);
    expect(one.body).toContain("Wedstrijd tegen SEV G3 is gewijzigd");

    const many = buildSyncSummary("t1", "Be Fair G2", [
      { type: "created", opponent: "A", matchDate: match.matchDate },
      { type: "result", opponent: "B", matchDate: match.matchDate },
    ]);
    expect(many.body).toBe("2 wijzigingen in het programma van Be Fair G2.");
    expect(many.url).toBe("/matches");
  });
});

describe("lineupPlayerIds", () => {
  const positions: LineupPosition[] = [
    { player_id: "p1", x: 0, y: 0, position_label: "GK" },
    { player_id: "p2", x: 0, y: 0, position_label: "CB" },
    { player_id: "loan", x: 0, y: 0, position_label: "ST", is_match_player: true },
  ];
  const plan: SubstitutionPlan = {
    teamType: "senioren",
    totalMinutes: 90,
    substitutionMoments: [
      {
        minute: 60,
        out: [{ player_id: "p2", name: "B", position_label: "CB" }],
        in: [{ player_id: "p3", name: "C", position_label: "CB" }],
      },
    ],
    playerMinutes: [],
  };

  it("includes starters and substitutes, skips loan players, dedupes", () => {
    expect(lineupPlayerIds(positions, plan).sort()).toEqual(["p1", "p2", "p3"]);
  });

  it("works without a substitution plan", () => {
    expect(lineupPlayerIds(positions, null).sort()).toEqual(["p1", "p2"]);
  });
});

describe("usersWithoutResponse", () => {
  it("returns account holders who did not answer, once per user", () => {
    const players = [
      { id: "p1", user_id: "u1" },
      { id: "p2", user_id: "u2" },
      { id: "p3", user_id: null },
      { id: "p4", user_id: "u1" },
    ];
    const availability = [{ player_id: "p2" }];
    expect(usersWithoutResponse(players, availability)).toEqual(["u1"]);
  });
});
