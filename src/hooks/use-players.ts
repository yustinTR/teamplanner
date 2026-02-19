"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { PlayerInsert, PlayerUpdate } from "@/types";

export function usePlayers(teamId: string | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["players", teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("team_id", teamId!)
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!teamId,
  });
}

export function usePlayer(playerId: string | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["player", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("id", playerId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!playerId,
  });
}

export function useCreatePlayer() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (player: PlayerInsert) => {
      const { data, error } = await supabase
        .from("players")
        .insert(player)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["players", data.team_id] });
    },
  });
}

export function useUpdatePlayer() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...update }: PlayerUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("players")
        .update(update)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["players", data.team_id] });
      queryClient.invalidateQueries({ queryKey: ["player", data.id] });
    },
  });
}

export function useDeactivatePlayer() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (playerId: string) => {
      const { data, error } = await supabase
        .from("players")
        .update({ is_active: false })
        .eq("id", playerId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["players", data.team_id] });
    },
  });
}
