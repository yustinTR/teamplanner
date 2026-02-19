"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { MatchInsert, MatchUpdate } from "@/types";

export function useMatches(teamId: string | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["matches", teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .eq("team_id", teamId!)
        .order("match_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!teamId,
  });
}

export function useMatch(matchId: string | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["match", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .eq("id", matchId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!matchId,
  });
}

export function useCreateMatch() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (match: MatchInsert) => {
      const { data, error } = await supabase
        .from("matches")
        .insert(match)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["matches", data.team_id] });
    },
  });
}

export function useUpdateMatch() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...update }: MatchUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("matches")
        .update(update)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["matches", data.team_id] });
      queryClient.invalidateQueries({ queryKey: ["match", data.id] });
    },
  });
}

export function useCancelMatch() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matchId: string) => {
      const { data, error } = await supabase
        .from("matches")
        .update({ status: "cancelled" as const })
        .eq("id", matchId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["matches", data.team_id] });
      queryClient.invalidateQueries({ queryKey: ["match", data.id] });
    },
  });
}
