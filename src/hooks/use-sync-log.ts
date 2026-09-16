"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { MatchChange } from "@/lib/match-sync";

export interface SyncLogEntry {
  id: string;
  run_at: string;
  matches_created: number;
  matches_updated: number;
  results_updated: number;
  changes: MatchChange[];
}

/**
 * Recent auto-sync runs for a team (RLS: team admins only).
 */
export function useSyncLog(teamId: string | undefined, limit = 5) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["sync-log", teamId, limit],
    queryFn: async (): Promise<SyncLogEntry[]> => {
      const { data, error } = await supabase
        .from("sync_log")
        .select("id, run_at, matches_created, matches_updated, results_updated, changes")
        .eq("team_id", teamId!)
        .order("run_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []).map((row) => ({
        ...row,
        changes: (row.changes as MatchChange[] | null) ?? [],
      }));
    },
    enabled: !!teamId,
  });
}
