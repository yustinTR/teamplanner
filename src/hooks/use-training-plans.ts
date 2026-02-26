"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { TrainingPlanUpdate } from "@/types";

export function useTrainingPlans(teamId: string | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["training-plans", teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_plans")
        .select("*, training_plan_exercises(count)")
        .eq("team_id", teamId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!teamId,
  });
}

export function useTrainingPlan(planId: string | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["training-plan", planId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_plans")
        .select("*, training_plan_exercises(*, exercises(*))")
        .eq("id", planId!)
        .single();
      if (error) throw error;
      // Sort exercises by sort_order
      if (data?.training_plan_exercises) {
        data.training_plan_exercises.sort(
          (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
        );
      }
      return data;
    },
    enabled: !!planId,
  });
}

export function useCreateTrainingPlan() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: { team_id: string; title: string; notes?: string | null; event_id?: string | null }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Niet ingelogd");

      const { data, error } = await supabase
        .from("training_plans")
        .insert({ ...plan, created_by: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["training-plans", data.team_id] });
    },
  });
}

export function useUpdateTrainingPlan() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...update }: TrainingPlanUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("training_plans")
        .update(update)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["training-plans", data.team_id] });
      queryClient.invalidateQueries({ queryKey: ["training-plan", data.id] });
    },
  });
}

export function useDeleteTrainingPlan() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, teamId }: { id: string; teamId: string }) => {
      const { error } = await supabase.from("training_plans").delete().eq("id", id);
      if (error) throw error;
      return { teamId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["training-plans", data.teamId] });
    },
  });
}
