import { describe, it, expect } from "vitest";
import { generateLineup } from "../lineup-generator";
import type { Player, AvailabilityWithPlayer } from "@/types";
import { createMockPlayer, createMockAvailabilityWithPlayer } from "@/lib/test/mock-data";

function makePlayers(count: number, primaryPosition?: string | null): Player[] {
  return Array.from({ length: count }, (_, i) =>
    createMockPlayer({
      id: `p-${i + 1}`,
      name: `Speler ${i + 1}`,
      jersey_number: i + 1,
      primary_position: primaryPosition === undefined ? null : primaryPosition,
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
      createMockPlayer({ id: "gk", primary_position: "K" }),
      ...Array.from({ length: 4 }, (_, i) =>
        createMockPlayer({ id: `def-${i}`, primary_position: "CB" })
      ),
      ...Array.from({ length: 3 }, (_, i) =>
        createMockPlayer({ id: `mid-${i}`, primary_position: "CM" })
      ),
      ...Array.from({ length: 3 }, (_, i) =>
        createMockPlayer({ id: `fwd-${i}`, primary_position: "ST" })
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
    const keeper = createMockPlayer({ id: "gk", primary_position: "K" });
    const others = Array.from({ length: 10 }, (_, i) =>
      createMockPlayer({ id: `p-${i}`, primary_position: "CM" })
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

  it("matches exact position labels to formation slots", () => {
    const players: Player[] = [
      createMockPlayer({ id: "gk", primary_position: "K" }),
      createMockPlayer({ id: "lb", primary_position: "LB" }),
      createMockPlayer({ id: "cb-1", primary_position: "CB" }),
      createMockPlayer({ id: "cb-2", primary_position: "CB" }),
      createMockPlayer({ id: "rb", primary_position: "RB" }),
      ...Array.from({ length: 3 }, (_, i) =>
        createMockPlayer({ id: `mid-${i}`, primary_position: "CM" })
      ),
      createMockPlayer({ id: "lw", primary_position: "LW" }),
      createMockPlayer({ id: "st", primary_position: "ST" }),
      createMockPlayer({ id: "rw", primary_position: "RW" }),
    ];
    const avail = makeAvailability(players);

    const result = generateLineup("4-3-3", players, avail);

    // LB slot should be filled by LB player
    const lbPos = result.positions.find((p) => p.position_label === "LB");
    expect(lbPos?.player_id).toBe("lb");

    // RB slot should be filled by RB player
    const rbPos = result.positions.find((p) => p.position_label === "RB");
    expect(rbPos?.player_id).toBe("rb");
  });

  it("matches secondary positions", () => {
    const players: Player[] = [
      createMockPlayer({ id: "gk", primary_position: "K" }),
      createMockPlayer({ id: "versatile", primary_position: "CM", secondary_positions: ["LB", "CB"] }),
      ...Array.from({ length: 9 }, (_, i) =>
        createMockPlayer({ id: `p-${i}`, primary_position: "ST" })
      ),
    ];
    const avail = makeAvailability(players);

    const result = generateLineup("4-3-3", players, avail);

    // Versatile player should be placed in CM (exact match) or one of the CB/LB slots
    const versatilePos = result.positions.find((p) => p.player_id === "versatile");
    expect(versatilePos).toBeDefined();
  });

  it("matches same category when no exact match", () => {
    const players: Player[] = [
      createMockPlayer({ id: "gk", primary_position: "K" }),
      createMockPlayer({ id: "cb-1", primary_position: "CB" }),
      createMockPlayer({ id: "cb-2", primary_position: "CB" }),
      createMockPlayer({ id: "cb-3", primary_position: "CB" }),
      createMockPlayer({ id: "cb-4", primary_position: "CB" }),
      ...Array.from({ length: 3 }, (_, i) =>
        createMockPlayer({ id: `mid-${i}`, primary_position: "CM" })
      ),
      ...Array.from({ length: 3 }, (_, i) =>
        createMockPlayer({ id: `fwd-${i}`, primary_position: "ST" })
      ),
    ];
    const avail = makeAvailability(players);

    const result = generateLineup("4-3-3", players, avail);

    // CB players should fill LB and RB slots (same category: defender)
    const defLabels = ["LB", "CB", "RB"];
    const defPositions = result.positions.filter((p) =>
      defLabels.includes(p.position_label)
    );
    for (const pos of defPositions) {
      expect(pos.player_id).toMatch(/^cb-/);
    }
  });

  it("puts remaining available players as substitutes", () => {
    const players: Player[] = [
      createMockPlayer({ id: "gk", primary_position: "K" }),
      ...Array.from({ length: 12 }, (_, i) =>
        createMockPlayer({ id: `p-${i}`, primary_position: "CM" })
      ),
    ];
    const avail = makeAvailability(players);

    const result = generateLineup("4-3-3", players, avail);

    expect(result.positions).toHaveLength(11);
    expect(result.substitutes.length).toBe(2); // 13 - 11 = 2
  });

  it("works with fewer than 11 players", () => {
    const players = [
      createMockPlayer({ id: "gk", primary_position: "K" }),
      createMockPlayer({ id: "def-1", primary_position: "CB" }),
      createMockPlayer({ id: "mid-1", primary_position: "CM" }),
    ];
    const avail = makeAvailability(players);

    const result = generateLineup("4-3-3", players, avail);

    expect(result.positions).toHaveLength(3);
    expect(result.substitutes).toHaveLength(0);
  });

  it("works when all players have the same position", () => {
    const players = makePlayers(11, "CM");
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
      primary_position: "K",
    });
    const maybePlayer = createMockPlayer({
      id: "maybe",
      primary_position: "K",
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
      createMockPlayer({ id: "gk", primary_position: "K" }),
      ...Array.from({ length: 10 }, (_, i) =>
        createMockPlayer({ id: `mid-${i}`, primary_position: "CM" })
      ),
      // Extra players as substitutes
      createMockPlayer({ id: "sub-def", primary_position: "CB" }),
      createMockPlayer({ id: "sub-fwd", primary_position: "ST" }),
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
