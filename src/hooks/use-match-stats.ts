"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { MatchStatsInsert } from "@/types";

export function useMatchStats(matchId: string | undefined) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["match-stats", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("match_stats")
        .select("*, players(name)")
        .eq("match_id", matchId!)
        .order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: !!matchId,
  });
}

export function useSaveMatchStats() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      matchId,
      stats,
    }: {
      matchId: string;
      stats: MatchStatsInsert[];
    }) => {
      const { data, error } = await supabase
        .from("match_stats")
        .upsert(stats, { onConflict: "match_id,player_id" })
        .select();
      if (error) throw error;
      return { matchId, data };
    },
    onSuccess: ({ matchId }) => {
      queryClient.invalidateQueries({ queryKey: ["match-stats", matchId] });
      queryClient.invalidateQueries({ queryKey: ["player-stats"] });
    },
  });
}
