"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { ExerciseFilters } from "@/types";

export function useExercises(filters?: ExerciseFilters) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["exercises", filters],
    queryFn: async () => {
      let query = supabase
        .from("exercises")
        .select("*")
        .eq("is_published", true)
        .order("category")
        .order("title");

      if (filters?.category) {
        query = query.eq("category", filters.category);
      }
      if (filters?.difficulty) {
        query = query.eq("difficulty", filters.difficulty);
      }
      if (filters?.teamType) {
        query = query.contains("team_types", [filters.teamType]);
      }
      if (filters?.maxDuration) {
        query = query.lte("duration_minutes", filters.maxDuration);
      }
      if (filters?.minPlayers) {
        query = query.gte("max_players", filters.minPlayers);
      }
      if (filters?.maxPlayers) {
        query = query.lte("min_players", filters.maxPlayers);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useExercise(exerciseId: string | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["exercise", exerciseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("id", exerciseId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!exerciseId,
  });
}
