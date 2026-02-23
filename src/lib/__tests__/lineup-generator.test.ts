import { describe, it, expect } from "vitest";
import { generateLineup, generateSubstitutionPlan, matchPlayerToPlayer } from "../lineup-generator";
import type { Player, AvailabilityWithPlayer } from "@/types";
import { createMockPlayer, createMockAvailabilityWithPlayer, createMockMatchPlayer } from "@/lib/test/mock-data";
import { TEAM_TYPE_CONFIG } from "../constants";

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

  it("substitute gets exact compat when secondary position matches a slot", () => {
    // Fill every slot with an exact primary match so sub-lw stays on bench
    const players: Player[] = [
      createMockPlayer({ id: "gk", primary_position: "K" }),
      createMockPlayer({ id: "lb", primary_position: "LB" }),
      createMockPlayer({ id: "cb1", primary_position: "CB" }),
      createMockPlayer({ id: "cb2", primary_position: "CB" }),
      createMockPlayer({ id: "rb", primary_position: "RB" }),
      createMockPlayer({ id: "cm1", primary_position: "CM" }),
      createMockPlayer({ id: "cm2", primary_position: "CM" }),
      createMockPlayer({ id: "cm3", primary_position: "CM" }),
      createMockPlayer({ id: "lw", primary_position: "LW" }),
      createMockPlayer({ id: "st", primary_position: "ST" }),
      createMockPlayer({ id: "rw", primary_position: "RW" }),
      // 12th player: CDM (not in 4-3-3), secondary includes LW
      createMockPlayer({ id: "sub-lw", primary_position: "CDM", secondary_positions: ["LW"] }),
    ];
    const avail = makeAvailability(players);

    const result = generateLineup("4-3-3", players, avail);

    const sub = result.substitutes.find((s) => s.player.id === "sub-lw");
    expect(sub).toBeDefined();
    // Should match LW slot via secondary_positions → exact compat
    expect(sub!.compatibility).toBe("exact");
  });

  it("substitute gets related compat when same category matches", () => {
    // Use LWB (defender, not in 4-3-3) so the player can't fill any slot exactly
    // but matches defender slots (LB, CB, RB) via same category → "related"
    const players: Player[] = [
      createMockPlayer({ id: "gk", primary_position: "K" }),
      createMockPlayer({ id: "lb", primary_position: "LB" }),
      createMockPlayer({ id: "cb1", primary_position: "CB" }),
      createMockPlayer({ id: "cb2", primary_position: "CB" }),
      createMockPlayer({ id: "rb", primary_position: "RB" }),
      ...Array.from({ length: 6 }, (_, i) =>
        createMockPlayer({ id: `filler-${i}`, primary_position: "CM" })
      ),
      // LWB player on bench — same category (defender) as LB/RB/CB slots
      createMockPlayer({ id: "sub-lwb", primary_position: "LWB" }),
    ];
    const avail = makeAvailability(players);

    const result = generateLineup("4-3-3", players, avail);

    const sub = result.substitutes.find((s) => s.player.id === "sub-lwb");
    expect(sub).toBeDefined();
    expect(sub!.compatibility).toBe("related");
  });

  it("uses related category fallback for keeper slot when only goalkeepers remain", () => {
    // All players are keepers — some will fill field slots via fallback
    const players = Array.from({ length: 11 }, (_, i) =>
      createMockPlayer({ id: `gk-${i}`, primary_position: "K" })
    );
    const avail = makeAvailability(players);

    const result = generateLineup("4-3-3", players, avail);

    expect(result.positions).toHaveLength(11);
  });
});

describe("matchPlayerToPlayer", () => {
  it("converts a MatchPlayer to a Player object", () => {
    const mp = createMockMatchPlayer({
      id: "mp-1",
      name: "Leen Speler",
      primary_position: "ST",
    });

    const player = matchPlayerToPlayer(mp);

    expect(player.id).toBe("mp-1");
    expect(player.name).toBe("Leen Speler");
    expect(player.primary_position).toBe("ST");
    expect(player.secondary_positions).toEqual([]);
    expect(player.role).toBe("player");
    expect(player.team_id).toBe("");
    expect(player.jersey_number).toBeNull();
    expect(player.is_active).toBe(true);
  });

  it("handles null position", () => {
    const mp = createMockMatchPlayer({ primary_position: null });

    const player = matchPlayerToPlayer(mp);

    expect(player.primary_position).toBeNull();
  });
});

describe("generateSubstitutionPlan", () => {
  it("returns null plan when not enough players for substitutions", () => {
    const players: Player[] = [
      createMockPlayer({ id: "gk", primary_position: "K" }),
      ...Array.from({ length: 10 }, (_, i) =>
        createMockPlayer({ id: `p-${i}`, primary_position: "CM" })
      ),
    ];
    const avail = makeAvailability(players);
    const config = TEAM_TYPE_CONFIG["senioren"];

    const result = generateSubstitutionPlan("4-3-3", players, avail, config);

    expect(result.positions).toHaveLength(11);
    expect(result.substitutionPlan).toBeNull();
  });

  it("generates a substitution plan with bench players", () => {
    const players: Player[] = [
      createMockPlayer({ id: "gk", primary_position: "K" }),
      ...Array.from({ length: 13 }, (_, i) =>
        createMockPlayer({ id: `p-${i}`, name: `Speler ${i}`, primary_position: "CM" })
      ),
    ];
    const avail = makeAvailability(players);
    const config = TEAM_TYPE_CONFIG["senioren"];

    const result = generateSubstitutionPlan("4-3-3", players, avail, config);

    expect(result.positions).toHaveLength(11);
    expect(result.substitutes).toHaveLength(3);
    expect(result.substitutionPlan).not.toBeNull();

    const plan = result.substitutionPlan!;
    expect(plan.totalMinutes).toBe(90); // 45 * 2
    expect(plan.teamType).toBe("Senioren");
    expect(plan.substitutionMoments.length).toBeGreaterThan(0);
    expect(plan.playerMinutes.length).toBe(14);

    // Every substitution moment should have in/out arrays
    for (const moment of plan.substitutionMoments) {
      expect(moment.minute).toBeGreaterThan(0);
      expect(moment.minute).toBeLessThan(90);
      expect(moment.out.length).toBeGreaterThan(0);
      expect(moment.in.length).toBe(moment.out.length);
    }

    // All players should have playing time
    for (const pm of plan.playerMinutes) {
      expect(pm.totalMinutes).toBeGreaterThan(0);
      expect(pm.percentage).toBeGreaterThan(0);
      expect(pm.percentage).toBeLessThanOrEqual(100);
      expect(pm.periods.length).toBeGreaterThan(0);
    }
  });

  it("generates plan for 7v7 G-team with shorter intervals", () => {
    const players: Player[] = [
      createMockPlayer({ id: "gk", primary_position: "K" }),
      ...Array.from({ length: 9 }, (_, i) =>
        createMockPlayer({ id: `p-${i}`, name: `Speler ${i}`, primary_position: "CM" })
      ),
    ];
    const avail = makeAvailability(players);
    const config = TEAM_TYPE_CONFIG["g_team"];

    const result = generateSubstitutionPlan("2-3-1", players, avail, config);

    expect(result.positions).toHaveLength(7);
    expect(result.substitutes).toHaveLength(3);
    expect(result.substitutionPlan).not.toBeNull();

    const plan = result.substitutionPlan!;
    expect(plan.totalMinutes).toBe(50); // 25 * 2
    expect(plan.teamType).toBe("G-Team");
    expect(plan.substitutionMoments.length).toBeGreaterThan(0);
  });

  it("does not rotate the keeper when there is only one", () => {
    const players: Player[] = [
      createMockPlayer({ id: "gk", primary_position: "K", name: "Keeper" }),
      ...Array.from({ length: 13 }, (_, i) =>
        createMockPlayer({ id: `p-${i}`, name: `Speler ${i}`, primary_position: "CM" })
      ),
    ];
    const avail = makeAvailability(players);
    const config = TEAM_TYPE_CONFIG["senioren"];

    const result = generateSubstitutionPlan("4-3-3", players, avail, config);

    const plan = result.substitutionPlan!;
    // Keeper should never appear in the "out" list
    for (const moment of plan.substitutionMoments) {
      for (const out of moment.out) {
        expect(out.player_id).not.toBe("gk");
      }
    }

    // Keeper should play 100%
    const keeperMinutes = plan.playerMinutes.find((pm) => pm.player_id === "gk");
    expect(keeperMinutes).toBeDefined();
    expect(keeperMinutes!.percentage).toBe(100);
  });

  it("rotates the keeper when there are multiple keepers", () => {
    const players: Player[] = [
      createMockPlayer({ id: "gk-1", primary_position: "K", name: "Keeper 1" }),
      createMockPlayer({ id: "gk-2", primary_position: "K", name: "Keeper 2" }),
      ...Array.from({ length: 12 }, (_, i) =>
        createMockPlayer({ id: `p-${i}`, name: `Speler ${i}`, primary_position: "CM" })
      ),
    ];
    const avail = makeAvailability(players);
    const config = TEAM_TYPE_CONFIG["senioren"];

    const result = generateSubstitutionPlan("4-3-3", players, avail, config);

    const plan = result.substitutionPlan!;
    // Both keepers should have some playing time but not necessarily 100%
    const gk1 = plan.playerMinutes.find((pm) => pm.player_id === "gk-1");
    const gk2 = plan.playerMinutes.find((pm) => pm.player_id === "gk-2");
    expect(gk1).toBeDefined();
    expect(gk2).toBeDefined();
    expect(gk1!.totalMinutes).toBeGreaterThan(0);
    expect(gk2!.totalMinutes).toBeGreaterThan(0);
  });

  it("player minutes are sorted ascending (least playing time first)", () => {
    const players: Player[] = [
      createMockPlayer({ id: "gk", primary_position: "K" }),
      ...Array.from({ length: 14 }, (_, i) =>
        createMockPlayer({ id: `p-${i}`, name: `Speler ${i}`, primary_position: "CM" })
      ),
    ];
    const avail = makeAvailability(players);
    const config = TEAM_TYPE_CONFIG["senioren"];

    const result = generateSubstitutionPlan("4-3-3", players, avail, config);

    const plan = result.substitutionPlan!;
    for (let i = 1; i < plan.playerMinutes.length; i++) {
      expect(plan.playerMinutes[i].totalMinutes).toBeGreaterThanOrEqual(
        plan.playerMinutes[i - 1].totalMinutes
      );
    }
  });

  it("substitution times avoid first and last 5 minutes", () => {
    const players: Player[] = [
      createMockPlayer({ id: "gk", primary_position: "K" }),
      ...Array.from({ length: 15 }, (_, i) =>
        createMockPlayer({ id: `p-${i}`, name: `Speler ${i}`, primary_position: "CM" })
      ),
    ];
    const avail = makeAvailability(players);
    const config = TEAM_TYPE_CONFIG["senioren"];

    const result = generateSubstitutionPlan("4-3-3", players, avail, config);

    const plan = result.substitutionPlan!;
    for (const moment of plan.substitutionMoments) {
      expect(moment.minute).toBeGreaterThanOrEqual(5);
      expect(moment.minute).toBeLessThanOrEqual(plan.totalMinutes - 5);
    }
  });
});
