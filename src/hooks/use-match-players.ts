"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { MatchPlayerInsert } from "@/types";

export function useMatchPlayers(matchId: string | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["match-players", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("match_players")
        .select("*")
        .eq("match_id", matchId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!matchId,
  });
}

export function useCreateMatchPlayer() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: MatchPlayerInsert) => {
      const { data, error } = await supabase
        .from("match_players")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["match-players", data.match_id] });
    },
  });
}

export function useDeleteMatchPlayer() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, matchId }: { id: string; matchId: string }) => {
      const { error } = await supabase
        .from("match_players")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return { matchId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["match-players", data.matchId] });
    },
  });
}
