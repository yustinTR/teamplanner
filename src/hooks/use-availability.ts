"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { AvailabilityStatus, AvailabilityWithPlayer } from "@/types";
import { trackEvent } from "@/lib/gtm";

export function useAvailability(matchId: string | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["availability", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("availability")
        .select("*, players(*)")
        .eq("match_id", matchId!);
      if (error) throw error;
      return data as unknown as AvailabilityWithPlayer[];
    },
    enabled: !!matchId,
  });
}

export function useSetAvailability() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playerId,
      matchId,
      status,
    }: {
      playerId: string;
      matchId: string;
      status: AvailabilityStatus;
    }) => {
      const { data, error } = await supabase
        .from("availability")
        .upsert(
          {
            player_id: playerId,
            match_id: matchId,
            status,
            responded_at: new Date().toISOString(),
          },
          { onConflict: "player_id,match_id" }
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onMutate: async ({ playerId, matchId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["availability", matchId] });
      const previous = queryClient.getQueryData<AvailabilityWithPlayer[]>(["availability", matchId]);
      queryClient.setQueryData<AvailabilityWithPlayer[]>(["availability", matchId], (old) => {
        if (!old) return old;
        const exists = old.find((a) => a.player_id === playerId);
        if (exists) {
          return old.map((a) => a.player_id === playerId ? { ...a, status } : a);
        }
        // New record: add a placeholder so the UI updates immediately
        return [...old, { id: `temp-${playerId}`, player_id: playerId, match_id: matchId, status, responded_at: new Date().toISOString(), players: null } as unknown as AvailabilityWithPlayer];
      });
      return { previous };
    },
    onError: (_err, { matchId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["availability", matchId], context.previous);
      }
    },
    onSuccess: (data) => {
      trackEvent("set_availability", { status: data.status });
      queryClient.invalidateQueries({ queryKey: ["availability", data.match_id] });
    },
  });
}

export function useAvailabilityRealtime(matchId: string | undefined) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  useEffect(() => {
    if (!matchId) return;

    const channel = supabase
      .channel(`availability:${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "availability",
          filter: `match_id=eq.${matchId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["availability", matchId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, queryClient, supabase]);
}
