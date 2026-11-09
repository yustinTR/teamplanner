"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { TeamInsert, TeamUpdate } from "@/types";
import { trackEvent } from "@/lib/gtm";

export function useTeam(teamId: string | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("id", teamId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!teamId,
  });
}

export function useCreateTeam() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playerNames = [],
      ...team
    }: Omit<TeamInsert, "created_by"> & { playerNames?: string[] }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Niet ingelogd");

      const { data, error } = await supabase
        .from("teams")
        .insert({ ...team, created_by: user.id })
        .select()
        .single();
      if (error) throw error;

      // Auto-create a player record for the coach
      const { error: playerError } = await supabase.from("players").insert({
        team_id: data.id,
        user_id: user.id,
        name: user.user_metadata?.name ?? user.email ?? "Coach",
      });
      if (playerError) throw new Error("Team aangemaakt, maar kon speler niet toevoegen. Probeer opnieuw.");

      // Players typed into a free tool before sign-up
      if (playerNames.length > 0) {
        const { error: rosterError } = await supabase
          .from("players")
          .insert(playerNames.map((name) => ({ team_id: data.id, name })));
        if (rosterError) throw new Error("Team aangemaakt, maar kon de spelers niet toevoegen. Voeg ze toe via Team.");
      }

      return data;
    },
    onSuccess: () => {
      trackEvent("create_team");
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });
}

export function useUpdateTeam() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...update }: TeamUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("teams")
        .update(update)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["team", data.id] });
    },
  });
}
