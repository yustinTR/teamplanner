import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useReorderPlanExercises } from "../use-training-plan-exercises";
import { createMockSupabase } from "@/lib/test/mock-supabase";
import { createQueryWrapper } from "@/lib/test/render-hook-utils";

const supabaseHolder = vi.hoisted(() => ({ current: null as unknown }));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => supabaseHolder.current,
}));

beforeEach(() => {
  supabaseHolder.current = null;
});

describe("useReorderPlanExercises", () => {
  it("parks rows on negative placeholders before writing the final order", async () => {
    const { client, builders } = createMockSupabase({ data: null, error: null });
    supabaseHolder.current = client;
    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useReorderPlanExercises(), { wrapper });
    result.current.mutate({
      planId: "plan-1",
      exercises: [
        { id: "row-b", sort_order: 0 },
        { id: "row-a", sort_order: 1 },
      ],
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const written = builders[0].update.mock.calls.map((call) => (call[0] as { sort_order: number }).sort_order);
    expect(written).toEqual([-1, -2, 0, 1]);
    expect(builders[0].eq.mock.calls.map((call) => call[1])).toEqual(["row-b", "row-a", "row-b", "row-a"]);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["training-plan", "plan-1"] });
  });

  it("surfaces an update error", async () => {
    const { client } = createMockSupabase({ data: null, error: new Error("duplicate key") });
    supabaseHolder.current = client;
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useReorderPlanExercises(), { wrapper });
    result.current.mutate({ planId: "plan-1", exercises: [{ id: "row-a", sort_order: 0 }] });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
