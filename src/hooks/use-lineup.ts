"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Json } from "@/lib/supabase/types";
import type { LineupPosition, SubstitutionPlan } from "@/types";

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

/**
 * Fire-and-forget: the server notifies selected players. Never blocks or
 * fails the save; silently skipped where fetch is unavailable (tests).
 */
function notifyLineupPublished(matchId: string) {
  if (typeof fetch !== "function") return;
  fetch("/api/push/lineup-published", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matchId }),
  }).catch(() => {});
}

export function useSaveLineup() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      matchId,
      formation,
      positions,
      substitutionPlan,
    }: {
      matchId: string;
      formation: string;
      positions: LineupPosition[];
      substitutionPlan?: SubstitutionPlan | null;
    }) => {
      const { data, error } = await supabase
        .from("lineups")
        .upsert(
          {
            match_id: matchId,
            formation,
            positions: JSON.parse(JSON.stringify(positions)) as Json,
            substitution_plan: substitutionPlan
              ? (JSON.parse(JSON.stringify(substitutionPlan)) as Json)
              : null,
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
      notifyLineupPublished(data.match_id);
    },
  });
}
