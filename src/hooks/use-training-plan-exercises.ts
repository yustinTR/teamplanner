"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useAddExerciseToPlan() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      planId,
      exerciseId,
      sortOrder,
    }: {
      planId: string;
      exerciseId: string;
      sortOrder: number;
    }) => {
      const { data, error } = await supabase
        .from("training_plan_exercises")
        .insert({ plan_id: planId, exercise_id: exerciseId, sort_order: sortOrder })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["training-plan", data.plan_id] });
    },
  });
}

export function useRemoveExerciseFromPlan() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, planId }: { id: string; planId: string }) => {
      const { error } = await supabase
        .from("training_plan_exercises")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return { planId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["training-plan", data.planId] });
    },
  });
}

export function useReorderPlanExercises() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      planId,
      exercises,
    }: {
      planId: string;
      exercises: { id: string; sort_order: number }[];
    }) => {
      // (plan_id, sort_order) is unique, so rows first move to negative
      // placeholders and then to their final slot; a single pass collides
      // with a row that still holds the target value.
      const run = async (rows: { id: string; sort_order: number }[]) => {
        const results = await Promise.all(
          rows.map(({ id, sort_order }) =>
            supabase.from("training_plan_exercises").update({ sort_order }).eq("id", id)
          )
        );
        const error = results.find((r) => r.error)?.error;
        if (error) throw error;
      };
      await run(exercises.map(({ id }, index) => ({ id, sort_order: -(index + 1) })));
      await run(exercises);
      return { planId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["training-plan", data.planId] });
    },
  });
}
