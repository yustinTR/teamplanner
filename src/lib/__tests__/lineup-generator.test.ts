import { describe, it, expect } from "vitest";
import { generateLineup } from "../lineup-generator";
import type { Player, AvailabilityWithPlayer } from "@/types";
import { createMockPlayer, createMockAvailabilityWithPlayer } from "@/lib/test/mock-data";

function makePlayers(count: number, position?: string | null): Player[] {
  return Array.from({ length: count }, (_, i) =>
    createMockPlayer({
      id: `p-${i + 1}`,
      name: `Speler ${i + 1}`,
      jersey_number: i + 1,
      position: position === undefined ? null : position,
    })
  );
}

function makeAvailability(
  players: Player[],
  status: "available" | "maybe" = "available"
): AvailabilityWithPlayer[] {
  return players.map((p) =>
    createMockAvailabilityWithPlayer({
      player_id: p.id,
      status,
      players: p,
    })
  );
}

describe("generateLineup", () => {
  it("generates a valid 11-player lineup with enough players", () => {
    const players: Player[] = [
      createMockPlayer({ id: "gk", position: "goalkeeper" }),
      ...Array.from({ length: 4 }, (_, i) =>
        createMockPlayer({ id: `def-${i}`, position: "defender" })
      ),
      ...Array.from({ length: 3 }, (_, i) =>
        createMockPlayer({ id: `mid-${i}`, position: "midfielder" })
      ),
      ...Array.from({ length: 3 }, (_, i) =>
        createMockPlayer({ id: `fwd-${i}`, position: "forward" })
      ),
    ];
    const avail = makeAvailability(players);

    const result = generateLineup("4-3-3", players, avail);

    expect(result.positions).toHaveLength(11);
    // All player IDs should be unique
    const ids = result.positions.map((p) => p.player_id);
    expect(new Set(ids).size).toBe(11);
  });

  it("fills the keeper slot first", () => {
    const keeper = createMockPlayer({ id: "gk", position: "goalkeeper" });
    const others = Array.from({ length: 10 }, (_, i) =>
      createMockPlayer({ id: `p-${i}`, position: "midfielder" })
    );
    const players = [keeper, ...others];
    const avail = makeAvailability(players);

    const result = generateLineup("4-3-3", players, avail);

    const keeperPosition = result.positions.find(
      (p) => p.position_label === "K"
    );
    expect(keeperPosition).toBeDefined();
    expect(keeperPosition!.player_id).toBe("gk");
  });

  it("matches defenders to defensive formation slots", () => {
    const players: Player[] = [
      createMockPlayer({ id: "gk", position: "goalkeeper" }),
      createMockPlayer({ id: "def-1", position: "defender" }),
      createMockPlayer({ id: "def-2", position: "defender" }),
      createMockPlayer({ id: "def-3", position: "defender" }),
      createMockPlayer({ id: "def-4", position: "defender" }),
      ...Array.from({ length: 3 }, (_, i) =>
        createMockPlayer({ id: `mid-${i}`, position: "midfielder" })
      ),
      ...Array.from({ length: 3 }, (_, i) =>
        createMockPlayer({ id: `fwd-${i}`, position: "forward" })
      ),
    ];
    const avail = makeAvailability(players);

    const result = generateLineup("4-3-3", players, avail);

    const defLabels = ["LB", "CB", "RB"];
    const defPositions = result.positions.filter((p) =>
      defLabels.includes(p.position_label)
    );
    // All defensive positions should be filled by defenders
    for (const pos of defPositions) {
      expect(pos.player_id).toMatch(/^def-/);
    }
  });

  it("puts remaining available players as substitutes", () => {
    const players: Player[] = [
      createMockPlayer({ id: "gk", position: "goalkeeper" }),
      ...Array.from({ length: 12 }, (_, i) =>
        createMockPlayer({ id: `p-${i}`, position: "midfielder" })
      ),
    ];
    const avail = makeAvailability(players);

    const result = generateLineup("4-3-3", players, avail);

    expect(result.positions).toHaveLength(11);
    expect(result.substitutes.length).toBe(2); // 13 - 11 = 2
  });

  it("works with fewer than 11 players", () => {
    const players = [
      createMockPlayer({ id: "gk", position: "goalkeeper" }),
      createMockPlayer({ id: "def-1", position: "defender" }),
      createMockPlayer({ id: "mid-1", position: "midfielder" }),
    ];
    const avail = makeAvailability(players);

    const result = generateLineup("4-3-3", players, avail);

    expect(result.positions).toHaveLength(3);
    expect(result.substitutes).toHaveLength(0);
  });

  it("works when all players have the same position", () => {
    const players = makePlayers(11, "midfielder");
    const avail = makeAvailability(players);

    const result = generateLineup("4-3-3", players, avail);

    expect(result.positions).toHaveLength(11);
    // All positions should be filled even though everyone is a midfielder
    const labels = result.positions.map((p) => p.position_label);
    expect(labels).toContain("K");
  });

  it("works when players have no position set", () => {
    const players = makePlayers(11, null);
    const avail = makeAvailability(players);

    const result = generateLineup("4-3-3", players, avail);

    expect(result.positions).toHaveLength(11);
  });

  it("prioritizes available over maybe players", () => {
    const availPlayer = createMockPlayer({
      id: "avail",
      position: "goalkeeper",
    });
    const maybePlayer = createMockPlayer({
      id: "maybe",
      position: "goalkeeper",
    });

    const availability: AvailabilityWithPlayer[] = [
      createMockAvailabilityWithPlayer({
        player_id: "avail",
        status: "available",
        players: availPlayer,
      }),
      createMockAvailabilityWithPlayer({
        player_id: "maybe",
        status: "maybe",
        players: maybePlayer,
      }),
    ];

    const result = generateLineup(
      "4-3-3",
      [maybePlayer, availPlayer],
      availability
    );

    const keeperPos = result.positions.find((p) => p.position_label === "K");
    expect(keeperPos?.player_id).toBe("avail");
  });

  it("falls back to unknown formation gracefully (defaults to 4-3-3)", () => {
    const players = makePlayers(11, null);
    const avail = makeAvailability(players);

    const result = generateLineup("unknown-formation", players, avail);

    expect(result.positions).toHaveLength(11);
  });

  it("substitute suggestions have correct compatibility labels", () => {
    const players: Player[] = [
      createMockPlayer({ id: "gk", position: "goalkeeper" }),
      ...Array.from({ length: 10 }, (_, i) =>
        createMockPlayer({ id: `mid-${i}`, position: "midfielder" })
      ),
      // Extra players as substitutes
      createMockPlayer({ id: "sub-def", position: "defender" }),
      createMockPlayer({ id: "sub-fwd", position: "forward" }),
    ];
    const avail = makeAvailability(players);

    const result = generateLineup("4-3-3", players, avail);

    expect(result.substitutes.length).toBe(2);
    // Substitutes should have compatibility set
    for (const sub of result.substitutes) {
      expect(["exact", "related", "any"]).toContain(sub.compatibility);
    }
  });

  it("handles empty player list", () => {
    const result = generateLineup("4-3-3", [], []);

    expect(result.positions).toHaveLength(0);
    expect(result.substitutes).toHaveLength(0);
  });
});
