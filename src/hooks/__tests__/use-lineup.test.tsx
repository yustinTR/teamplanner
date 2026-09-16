import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useLineup, useSaveLineup } from "../use-lineup";
import { createMockSupabase } from "@/lib/test/mock-supabase";
import { createQueryWrapper } from "@/lib/test/render-hook-utils";
import type { LineupPosition } from "@/types";

const supabaseHolder = vi.hoisted(() => ({ current: null as unknown }));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => supabaseHolder.current,
}));

const lineupRow = {
  id: "lineup-1",
  match_id: "match-1",
  formation: "4-3-3",
  positions: [],
  substitution_plan: null,
};

beforeEach(() => {
  supabaseHolder.current = null;
});

describe("useLineup", () => {
  it("returns the lineup for a match", async () => {
    const { client, builders } = createMockSupabase({
      data: lineupRow,
      error: null,
    });
    supabaseHolder.current = client;
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useLineup("match-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(lineupRow);
    expect(client.from).toHaveBeenCalledWith("lineups");
    expect(builders[0].eq).toHaveBeenCalledWith("match_id", "match-1");
    expect(builders[0].single).toHaveBeenCalled();
  });

  it("treats a missing lineup (PGRST116) as empty, not an error", async () => {
    const { client } = createMockSupabase({
      data: null,
      error: { code: "PGRST116", message: "no rows" },
    });
    supabaseHolder.current = client;
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useLineup("match-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it("surfaces other errors", async () => {
    const { client } = createMockSupabase({
      data: null,
      error: { code: "500", message: "boom" },
    });
    supabaseHolder.current = client;
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useLineup("match-1"), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("does not fetch without a matchId", () => {
    const { client } = createMockSupabase({ data: null, error: null });
    supabaseHolder.current = client;
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useLineup(undefined), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
    expect(client.from).not.toHaveBeenCalled();
  });
});

describe("useSaveLineup", () => {
  const positions: LineupPosition[] = [
    { positionId: "gk", playerId: "player-1" } as unknown as LineupPosition,
  ];

  it("upserts the lineup keyed on match_id and invalidates", async () => {
    const { client, builders } = createMockSupabase({
      data: lineupRow,
      error: null,
    });
    supabaseHolder.current = client;
    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useSaveLineup(), { wrapper });
    result.current.mutate({
      matchId: "match-1",
      formation: "4-3-3",
      positions,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(builders[0].upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        match_id: "match-1",
        formation: "4-3-3",
        substitution_plan: null,
      }),
      { onConflict: "match_id" }
    );
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["lineup", "match-1"],
    });
  });

  it("serializes the substitution plan when provided", async () => {
    const { client, builders } = createMockSupabase({
      data: lineupRow,
      error: null,
    });
    supabaseHolder.current = client;
    const { wrapper } = createQueryWrapper();

    const plan = { intervals: [] } as unknown as NonNullable<
      Parameters<
        ReturnType<typeof useSaveLineup>["mutate"]
      >[0]["substitutionPlan"]
    >;

    const { result } = renderHook(() => useSaveLineup(), { wrapper });
    result.current.mutate({
      matchId: "match-1",
      formation: "4-3-3",
      positions,
      substitutionPlan: plan,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(builders[0].upsert).toHaveBeenCalledWith(
      expect.objectContaining({ substitution_plan: { intervals: [] } }),
      { onConflict: "match_id" }
    );
  });

  it("surfaces save errors", async () => {
    const { client } = createMockSupabase({
      data: null,
      error: new Error("rls denied"),
    });
    supabaseHolder.current = client;
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useSaveLineup(), { wrapper });
    result.current.mutate({
      matchId: "match-1",
      formation: "4-3-3",
      positions,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
