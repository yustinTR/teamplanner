import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import {
  useMatches,
  useMatch,
  useCreateMatch,
  useUpdateMatch,
  useCancelMatch,
  useRefreshMatches,
} from "../use-matches";
import { createMockSupabase } from "@/lib/test/mock-supabase";
import { createQueryWrapper } from "@/lib/test/render-hook-utils";
import type { MatchInsert } from "@/types";

const supabaseHolder = vi.hoisted(() => ({ current: null as unknown }));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => supabaseHolder.current,
}));

const match = {
  id: "match-1",
  team_id: "team-1",
  opponent: "SEV G3",
  match_date: "2026-10-03T08:30:00Z",
  status: "upcoming",
};

beforeEach(() => {
  supabaseHolder.current = null;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useMatches", () => {
  it("returns matches ordered by date", async () => {
    const { client, builders } = createMockSupabase({
      data: [match],
      error: null,
    });
    supabaseHolder.current = client;
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useMatches("team-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([match]);
    expect(client.from).toHaveBeenCalledWith("matches");
    expect(builders[0].eq).toHaveBeenCalledWith("team_id", "team-1");
    expect(builders[0].order).toHaveBeenCalledWith("match_date", {
      ascending: true,
    });
  });

  it("does not fetch without a teamId", () => {
    const { client } = createMockSupabase({ data: [], error: null });
    supabaseHolder.current = client;
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useMatches(undefined), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
    expect(client.from).not.toHaveBeenCalled();
  });
});

describe("useMatch", () => {
  it("returns a single match by id", async () => {
    const { client, builders } = createMockSupabase({
      data: match,
      error: null,
    });
    supabaseHolder.current = client;
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useMatch("match-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(match);
    expect(builders[0].eq).toHaveBeenCalledWith("id", "match-1");
    expect(builders[0].single).toHaveBeenCalled();
  });
});

describe("useCreateMatch", () => {
  it("inserts a match and invalidates the team's matches", async () => {
    const { client, builders } = createMockSupabase({
      data: match,
      error: null,
    });
    supabaseHolder.current = client;
    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const insert = {
      team_id: "team-1",
      opponent: "SEV G3",
      match_date: "2026-10-03T08:30:00Z",
    } as MatchInsert;

    const { result } = renderHook(() => useCreateMatch(), { wrapper });
    result.current.mutate(insert);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(builders[0].insert).toHaveBeenCalledWith(insert);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["matches", "team-1"],
    });
  });

  it("surfaces insert errors", async () => {
    const { client } = createMockSupabase({
      data: null,
      error: new Error("rls denied"),
    });
    supabaseHolder.current = client;
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useCreateMatch(), { wrapper });
    result.current.mutate({ team_id: "team-1" } as MatchInsert);

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useUpdateMatch", () => {
  it("updates a match and invalidates both query keys", async () => {
    const { client, builders } = createMockSupabase({
      data: match,
      error: null,
    });
    supabaseHolder.current = client;
    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateMatch(), { wrapper });
    result.current.mutate({ id: "match-1", opponent: "Nieuw FC" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(builders[0].update).toHaveBeenCalledWith({ opponent: "Nieuw FC" });
    expect(builders[0].eq).toHaveBeenCalledWith("id", "match-1");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["matches", "team-1"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["match", "match-1"],
    });
  });
});

describe("useCancelMatch", () => {
  it("sets the match status to cancelled", async () => {
    const cancelled = { ...match, status: "cancelled" };
    const { client, builders } = createMockSupabase({
      data: cancelled,
      error: null,
    });
    supabaseHolder.current = client;
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useCancelMatch(), { wrapper });
    result.current.mutate("match-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(builders[0].update).toHaveBeenCalledWith({ status: "cancelled" });
    expect(builders[0].eq).toHaveBeenCalledWith("id", "match-1");
  });
});

describe("useRefreshMatches", () => {
  it("posts to the refresh API and returns the results", async () => {
    const results = { matchesCreated: 3, matchesUpdated: 1, errors: [] };
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ results }),
      }))
    );
    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useRefreshMatches(), { wrapper });
    result.current.mutate("team-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(results);
    expect(fetch).toHaveBeenCalledWith(
      "/api/import-voetbal-nl/refresh",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ teamId: "team-1" }),
      })
    );
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["matches", "team-1"],
    });
  });

  it("throws the API error message on failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        json: async () => ({ error: "Team niet gevonden." }),
      }))
    );
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useRefreshMatches(), { wrapper });
    result.current.mutate("team-1");

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error).message).toBe(
      "Team niet gevonden."
    );
  });
});
