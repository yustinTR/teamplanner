import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import {
  useAvailability,
  useSetAvailability,
  useAvailabilityRealtime,
} from "../use-availability";
import { createMockSupabase } from "@/lib/test/mock-supabase";
import { createQueryWrapper } from "@/lib/test/render-hook-utils";
import type { AvailabilityWithPlayer } from "@/types";

const supabaseHolder = vi.hoisted(() => ({ current: null as unknown }));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => supabaseHolder.current,
}));

vi.mock("@/lib/gtm", () => ({ trackEvent: vi.fn() }));

const row = (overrides: Partial<AvailabilityWithPlayer> = {}) =>
  ({
    id: "avail-1",
    player_id: "player-1",
    match_id: "match-1",
    status: "available",
    responded_at: "2026-09-01T10:00:00Z",
    players: null,
    ...overrides,
  }) as AvailabilityWithPlayer;

beforeEach(() => {
  supabaseHolder.current = null;
});

describe("useAvailability", () => {
  it("returns availability rows for a match", async () => {
    const { client, builders } = createMockSupabase({
      data: [row()],
      error: null,
    });
    supabaseHolder.current = client;
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useAvailability("match-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([row()]);
    expect(client.from).toHaveBeenCalledWith("availability");
    expect(builders[0].select).toHaveBeenCalledWith("*, players(*)");
    expect(builders[0].eq).toHaveBeenCalledWith("match_id", "match-1");
  });

  it("does not fetch without a matchId", () => {
    const { client } = createMockSupabase({ data: [], error: null });
    supabaseHolder.current = client;
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useAvailability(undefined), {
      wrapper,
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(client.from).not.toHaveBeenCalled();
  });

  it("surfaces query errors", async () => {
    const { client } = createMockSupabase({
      data: null,
      error: new Error("boom"),
    });
    supabaseHolder.current = client;
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useAvailability("match-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useSetAvailability", () => {
  it("upserts and invalidates the availability query", async () => {
    const saved = row({ status: "unavailable" });
    const { client, builders } = createMockSupabase({
      data: saved,
      error: null,
    });
    supabaseHolder.current = client;
    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useSetAvailability(), { wrapper });
    result.current.mutate({
      playerId: "player-1",
      matchId: "match-1",
      status: "unavailable",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(builders[0].upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        player_id: "player-1",
        match_id: "match-1",
        status: "unavailable",
      }),
      { onConflict: "player_id,match_id" }
    );
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["availability", "match-1"],
    });
  });

  it("optimistically updates an existing row in the cache", async () => {
    const { client } = createMockSupabase({
      data: row({ status: "maybe" }),
      error: null,
    });
    supabaseHolder.current = client;
    const { wrapper, queryClient } = createQueryWrapper();
    queryClient.setQueryData(["availability", "match-1"], [row()]);

    const { result } = renderHook(() => useSetAvailability(), { wrapper });
    result.current.mutate({
      playerId: "player-1",
      matchId: "match-1",
      status: "maybe",
    });

    await waitFor(() => {
      const cached = queryClient.getQueryData<AvailabilityWithPlayer[]>([
        "availability",
        "match-1",
      ]);
      expect(cached?.[0].status).toBe("maybe");
    });
  });

  it("adds a placeholder row for a player without a response", async () => {
    const { client } = createMockSupabase({ data: row(), error: null });
    supabaseHolder.current = client;
    const { wrapper, queryClient } = createQueryWrapper();
    queryClient.setQueryData(["availability", "match-1"], []);

    const { result } = renderHook(() => useSetAvailability(), { wrapper });
    result.current.mutate({
      playerId: "player-2",
      matchId: "match-1",
      status: "available",
    });

    await waitFor(() => {
      const cached = queryClient.getQueryData<AvailabilityWithPlayer[]>([
        "availability",
        "match-1",
      ]);
      expect(cached?.some((a) => a.player_id === "player-2")).toBe(true);
    });
  });

  it("rolls back the cache when the mutation fails", async () => {
    const { client } = createMockSupabase({
      data: null,
      error: new Error("db down"),
    });
    supabaseHolder.current = client;
    const { wrapper, queryClient } = createQueryWrapper();
    const original = [row()];
    queryClient.setQueryData(["availability", "match-1"], original);

    const { result } = renderHook(() => useSetAvailability(), { wrapper });
    result.current.mutate({
      playerId: "player-1",
      matchId: "match-1",
      status: "unavailable",
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(
      queryClient.getQueryData(["availability", "match-1"])
    ).toEqual(original);
  });
});

describe("useAvailabilityRealtime", () => {
  it("subscribes to match changes and invalidates on events", () => {
    const { client, channel } = createMockSupabase({ data: [], error: null });
    supabaseHolder.current = client;
    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { unmount } = renderHook(
      () => useAvailabilityRealtime("match-1"),
      { wrapper }
    );

    expect(client.channel).toHaveBeenCalledWith("availability:match-1");
    expect(channel.subscribe).toHaveBeenCalled();

    // Fire the registered postgres_changes handler
    const handler = channel.on.mock.calls[0][2] as () => void;
    handler();
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["availability", "match-1"],
    });

    unmount();
    expect(client.removeChannel).toHaveBeenCalled();
  });

  it("does nothing without a matchId", () => {
    const { client } = createMockSupabase({ data: [], error: null });
    supabaseHolder.current = client;
    const { wrapper } = createQueryWrapper();

    renderHook(() => useAvailabilityRealtime(undefined), { wrapper });

    expect(client.channel).not.toHaveBeenCalled();
  });
});
