import { describe, expect, it } from "vitest";
import {
  AGE_GROUPS,
  exercisePath,
  exerciseSlug,
  exercisesForAgeGroup,
  groupByCategory,
  relatedExercises,
  shortDescription,
} from "../public-exercises";
import { ACTIVE_TEAM_TYPES } from "../constants";
import type { Exercise } from "@/types";

function exercise(overrides: Partial<Exercise>): Exercise {
  return {
    id: "id",
    title: "Oefening",
    category: "passing",
    difficulty: "basis",
    description: "Beschrijving.",
    setup_instructions: null,
    variations: null,
    duration_minutes: 10,
    min_players: null,
    max_players: null,
    team_types: null,
    video_url: null,
    is_published: true,
    created_at: "2026-02-26T00:00:00Z",
    updated_at: "2026-02-26T00:00:00Z",
    ...overrides,
  };
}

describe("exerciseSlug", () => {
  it("makes readable URL slugs from Dutch titles", () => {
    expect(exerciseSlug("Aanvallen voor pupillen: 2 tegen 1")).toBe("aanvallen-voor-pupillen-2-tegen-1");
    expect(exerciseSlug("Positiespel 3 tegen 3 + 1")).toBe("positiespel-3-tegen-3-1");
    expect(exerciseSlug("Eén-twee en afronden")).toBe("een-twee-en-afronden");
    expect(exerciseSlug("Ladder oefening (speed ladder)")).toBe("ladder-oefening-speed-ladder");
  });

  it("builds the public path", () => {
    expect(exercisePath("Rondo 4 tegen 2")).toBe("/voetbaloefeningen/rondo-4-tegen-2");
  });
});

describe("AGE_GROUPS", () => {
  it("only uses team types that coaches can pick", () => {
    for (const g of AGE_GROUPS) {
      expect(ACTIVE_TEAM_TYPES as readonly string[]).toContain(g.teamType);
    }
  });

  it("has unique slugs", () => {
    const slugs = AGE_GROUPS.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("filters", () => {
  const a = exercise({ id: "a", category: "passing", team_types: ["jo10", "senioren"] });
  const b = exercise({ id: "b", category: "passing", team_types: ["senioren"] });
  const c = exercise({ id: "c", category: "afwerken", team_types: ["jo10"] });

  it("selects exercises for an age group", () => {
    const jo10 = AGE_GROUPS.find((g) => g.slug === "jo10")!;
    expect(exercisesForAgeGroup([a, b, c], jo10).map((e) => e.id)).toEqual(["a", "c"]);
  });

  it("relates exercises from the same category only", () => {
    expect(relatedExercises([a, b, c], a).map((e) => e.id)).toEqual(["b"]);
  });

  it("groups by category in first-seen order", () => {
    expect(groupByCategory([a, c, b]).map(([cat, list]) => [cat, list.length])).toEqual([
      ["passing", 2],
      ["afwerken", 1],
    ]);
  });
});

describe("shortDescription", () => {
  it("keeps short text whole", () => {
    expect(shortDescription("Korte tekst.")).toBe("Korte tekst.");
  });

  it("caps long text at the limit", () => {
    const long = "woord ".repeat(60).trim();
    const result = shortDescription(long);
    expect(result.length).toBeLessThanOrEqual(155);
    expect(result.endsWith("…")).toBe(true);
  });
});
