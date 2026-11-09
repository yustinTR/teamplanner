import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCreateTeam } from "../use-team";
import { createMockSupabase } from "@/lib/test/mock-supabase";
import { createQueryWrapper } from "@/lib/test/render-hook-utils";

const supabaseHolder = vi.hoisted(() => ({ current: null as unknown }));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => supabaseHolder.current,
}));

function clientWithUser(...results: Parameters<typeof createMockSupabase>) {
  const mock = createMockSupabase(...results);
  const client = {
    ...mock.client,
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: { id: "coach-1", email: "coach@example.test", user_metadata: { name: "Coach" } } },
      })),
    },
  };
  return { ...mock, client };
}

beforeEach(() => {
  supabaseHolder.current = null;
});

describe("useCreateTeam", () => {
  it("adds the players carried over from a free tool", async () => {
    const { client, builders } = clientWithUser(
      { data: { id: "team-1" }, error: null }, // teams insert
      { data: null, error: null }, // coach player
      { data: null, error: null } // roster
    );
    supabaseHolder.current = client;
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useCreateTeam(), { wrapper });
    result.current.mutate({ name: "JO10-2", team_type: "jo10", playerNames: ["Sem", "Daan"] });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(builders[0].insert).toHaveBeenCalledWith(
      expect.not.objectContaining({ playerNames: expect.anything() })
    );
    expect(builders[2].insert).toHaveBeenCalledWith([
      { team_id: "team-1", name: "Sem" },
      { team_id: "team-1", name: "Daan" },
    ]);
  });

  it("creates only the coach when there are no carried-over players", async () => {
    const { client } = clientWithUser({ data: { id: "team-1" }, error: null }, { data: null, error: null });
    supabaseHolder.current = client;
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useCreateTeam(), { wrapper });
    result.current.mutate({ name: "Zaterdag 3", team_type: "senioren" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(client.from).toHaveBeenCalledTimes(2);
  });
});
