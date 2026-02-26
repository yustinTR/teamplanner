"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { PlayerSeasonStats } from "@/types";
import { aggregatePlayerStats } from "@/lib/player-stats-utils";

export function usePlayerSeasonStats(
  playerId: string | undefined,
  teamId: string | undefined
) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["player-stats", playerId, teamId],
    queryFn: async (): Promise<PlayerSeasonStats | null> => {
      const { data: player } = await supabase
        .from("players")
        .select("name")
        .eq("id", playerId!)
        .single();
      if (!player) return null;

      const { data: matches } = await supabase
        .from("matches")
        .select("id")
        .eq("team_id", teamId!)
        .eq("status", "completed");

      const matchIds = (matches ?? []).map((m) => m.id);
      if (matchIds.length === 0) {
        return {
          playerId: playerId!,
          playerName: player.name,
          matchesPlayed: 0,
          totalMinutes: 0,
          averageMinutes: 0,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
        };
      }

      const { data: lineups } = await supabase
        .from("lineups")
        .select("match_id, substitution_plan")
        .in("match_id", matchIds);

      const { data: stats } = await supabase
        .from("match_stats")
        .select("player_id, goals, assists, yellow_cards, red_cards")
        .eq("player_id", playerId!)
        .in("match_id", matchIds);

      const results = aggregatePlayerStats(
        [{ id: playerId!, name: player.name }],
        lineups ?? [],
        stats ?? []
      );
      return results[0] ?? null;
    },
    enabled: !!playerId && !!teamId,
  });
}

export function useTeamSeasonStats(teamId: string | undefined) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["player-stats", "team", teamId],
    queryFn: async (): Promise<PlayerSeasonStats[]> => {
      const { data: players } = await supabase
        .from("players")
        .select("id, name")
        .eq("team_id", teamId!)
        .eq("is_active", true)
        .neq("role", "staff");
      if (!players?.length) return [];

      const { data: matches } = await supabase
        .from("matches")
        .select("id")
        .eq("team_id", teamId!)
        .eq("status", "completed");
      const matchIds = (matches ?? []).map((m) => m.id);
      if (matchIds.length === 0) {
        return players.map((p) => ({
          playerId: p.id,
          playerName: p.name,
          matchesPlayed: 0,
          totalMinutes: 0,
          averageMinutes: 0,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
        }));
      }

      const { data: lineups } = await supabase
        .from("lineups")
        .select("match_id, substitution_plan")
        .in("match_id", matchIds);

      const { data: allStats } = await supabase
        .from("match_stats")
        .select("player_id, goals, assists, yellow_cards, red_cards")
        .in("match_id", matchIds);

      return aggregatePlayerStats(
        players,
        lineups ?? [],
        allStats ?? []
      );
    },
    enabled: !!teamId,
  });
}
