"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Json } from "@/lib/supabase/types";
import type { LineupPosition } from "@/types";

export function useLineup(matchId: string | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["lineup", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lineups")
        .select("*")
        .eq("match_id", matchId!)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!matchId,
  });
}

export function useSaveLineup() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      matchId,
      formation,
      positions,
    }: {
      matchId: string;
      formation: string;
      positions: LineupPosition[];
    }) => {
      const { data, error } = await supabase
        .from("lineups")
        .upsert(
          {
            match_id: matchId,
            formation,
            positions: JSON.parse(JSON.stringify(positions)) as Json,
          },
          { onConflict: "match_id" }
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lineup", data.match_id] });
    },
  });
}
