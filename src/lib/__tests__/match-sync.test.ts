import { describe, it, expect } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../supabase/types";
import { parseDate, upsertMatches, applyResults } from "../match-sync";
import type { ParsedMatch, ParsedResult } from "../voetbal-nl-parser";

interface ExistingRow {
  id: string;
  opponent: string;
  match_date: string;
  home_away: "home" | "away";
  location: string | null;
  score_home: number | null;
  score_away: number | null;
}

function createMockClient(existing: ExistingRow[]) {
  const updates: Array<{ id: string; values: Record<string, unknown> }> = [];
  const inserts: Array<Record<string, unknown>> = [];

  const client = {
    from() {
      return {
        select() {
          return {
            eq: async () => ({ data: existing }),
          };
        },
        update(values: Record<string, unknown>) {
          return {
            eq: async (_column: string, id: string) => {
              updates.push({ id, values });
              return { error: null };
            },
          };
        },
        insert: async (values: Record<string, unknown>) => {
          inserts.push(values);
          return { error: null };
        },
      };
    },
  };

  return {
    client: client as unknown as SupabaseClient<Database>,
    updates,
    inserts,
  };
}

function localIso(
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number
): string {
  return new Date(year, month - 1, day, hours, minutes, 0).toISOString();
}

function existingMatch(overrides: Partial<ExistingRow> = {}): ExistingRow {
  return {
    id: "match-1",
    opponent: "SEV G3",
    match_date: localIso(2026, 10, 3, 8, 30),
    home_away: "home",
    location: "Sportpark 't Suyt",
    score_home: null,
    score_away: null,
    ...overrides,
  };
}

describe("parseDate", () => {
  it("parses dd-mm-yyyy with time", () => {
    const iso = parseDate("28-02-2026 11:30");
    expect(iso).toBe(localIso(2026, 2, 28, 11, 30));
  });

  it("defaults to 14:00 when no time is given", () => {
    const iso = parseDate("28-02-2026");
    expect(iso).toBe(localIso(2026, 2, 28, 14, 0));
  });

  it("handles 2-digit years", () => {
    const iso = parseDate("01-09-26 10:00");
    expect(iso).toBe(localIso(2026, 9, 1, 10, 0));
  });

  it("rejects rolled-over dates like Feb 31", () => {
    expect(parseDate("31-02-2026")).toBeNull();
  });

  it("rejects garbage input", () => {
    expect(parseDate("geen datum")).toBeNull();
  });
});

describe("upsertMatches", () => {
  const newMatch: ParsedMatch = {
    date: "05-09-2026 09:45",
    opponent: "VEP G2",
    homeAway: "home",
    location: "Sportpark 't Suyt",
  };

  it("inserts a match that does not exist yet", async () => {
    const { client, inserts, updates } = createMockClient([]);
    const result = await upsertMatches(client, "team-1", [newMatch]);

    expect(result.matchesCreated).toBe(1);
    expect(result.matchesUpdated).toBe(0);
    expect(inserts).toHaveLength(1);
    expect(updates).toHaveLength(0);
    expect(inserts[0]).toMatchObject({
      team_id: "team-1",
      opponent: "VEP G2",
      home_away: "home",
      status: "upcoming",
    });
    expect(result.changes).toEqual([
      {
        type: "created",
        opponent: "VEP G2",
        matchDate: localIso(2026, 9, 5, 9, 45),
      },
    ]);
  });

  it("updates an existing match when the time changed", async () => {
    const { client, updates, inserts } = createMockClient([existingMatch()]);
    const result = await upsertMatches(client, "team-1", [
      {
        date: "03-10-2026 09:45",
        opponent: "SEV G3",
        homeAway: "home",
        location: "Sportpark 't Suyt",
      },
    ]);

    expect(result.matchesUpdated).toBe(1);
    expect(result.matchesCreated).toBe(0);
    expect(inserts).toHaveLength(0);
    expect(updates).toHaveLength(1);
    expect(updates[0].id).toBe("match-1");
    expect(updates[0].values.match_date).toBe(localIso(2026, 10, 3, 9, 45));
  });

  it("matches opponents case-insensitively", async () => {
    const { client, updates } = createMockClient([existingMatch()]);
    const result = await upsertMatches(client, "team-1", [
      {
        date: "03-10-2026 09:45",
        opponent: "sev g3",
        homeAway: "home",
        location: null,
      },
    ]);

    expect(result.matchesUpdated).toBe(1);
    expect(updates).toHaveLength(1);
  });

  it("leaves unchanged matches untouched", async () => {
    const { client, updates, inserts } = createMockClient([existingMatch()]);
    const result = await upsertMatches(client, "team-1", [
      {
        date: "03-10-2026 08:30",
        opponent: "SEV G3",
        homeAway: "home",
        location: "Sportpark 't Suyt",
      },
    ]);

    expect(result.matchesCreated).toBe(0);
    expect(result.matchesUpdated).toBe(0);
    expect(updates).toHaveLength(0);
    expect(inserts).toHaveLength(0);
    expect(result.changes).toHaveLength(0);
  });

  it("does not wipe an existing location when the parsed location is null", async () => {
    const { client, updates } = createMockClient([existingMatch()]);
    await upsertMatches(client, "team-1", [
      {
        date: "03-10-2026 09:45",
        opponent: "SEV G3",
        homeAway: "home",
        location: null,
      },
    ]);

    expect(updates[0].values.location).toBe("Sportpark 't Suyt");
  });

  it("reports an error for an invalid date", async () => {
    const { client, inserts } = createMockClient([]);
    const result = await upsertMatches(client, "team-1", [
      { date: "ongeldig", opponent: "VEP G2", homeAway: "home", location: null },
    ]);

    expect(result.errors).toHaveLength(1);
    expect(inserts).toHaveLength(0);
  });
});

describe("applyResults", () => {
  const sevResult: ParsedResult = {
    date: "03-10-2026 08:30",
    opponent: "SEV G3",
    scoreHome: 3, // own goals (team-relative)
    scoreAway: 1,
  };

  it("stores scores in scoreboard order for a home match", async () => {
    const { client, updates } = createMockClient([
      existingMatch({ home_away: "home" }),
    ]);
    const result = await applyResults(client, "team-1", [sevResult]);

    expect(result.resultsUpdated).toBe(1);
    expect(updates[0].values).toMatchObject({
      score_home: 3,
      score_away: 1,
      status: "completed",
    });
  });

  it("flips scores for an away match", async () => {
    const { client, updates } = createMockClient([
      existingMatch({ home_away: "away" }),
    ]);
    await applyResults(client, "team-1", [sevResult]);

    expect(updates[0].values).toMatchObject({
      score_home: 1,
      score_away: 3,
    });
  });

  it("never overwrites a manually entered score", async () => {
    const { client, updates } = createMockClient([
      existingMatch({ score_home: 2, score_away: 2 }),
    ]);
    const result = await applyResults(client, "team-1", [sevResult]);

    expect(result.resultsUpdated).toBe(0);
    expect(updates).toHaveLength(0);
  });

  it("skips results without a matching match", async () => {
    const { client, updates } = createMockClient([]);
    const result = await applyResults(client, "team-1", [sevResult]);

    expect(result.resultsUpdated).toBe(0);
    expect(updates).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
  });
});
