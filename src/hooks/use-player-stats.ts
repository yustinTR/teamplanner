"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { PlayerSeasonStats } from "@/types";
import { aggregatePlayerStats } from "@/lib/player-stats-utils";
import { TEAM_TYPE_CONFIG } from "@/lib/constants";

function getDefaultMatchMinutes(teamType: string | null | undefined): number {
  const config = teamType ? TEAM_TYPE_CONFIG[teamType] : undefined;
  return config ? config.halfMinutes * config.halves : 90;
}

export function usePlayerSeasonStats(
  playerId: string | undefined,
  teamId: string | undefined
) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["player-stats", playerId, teamId],
    queryFn: async (): Promise<PlayerSeasonStats | null> => {
      // Parallel batch 1: independent queries
      const [teamRes, playerRes, matchesRes] = await Promise.all([
        supabase
          .from("teams")
          .select("team_type")
          .eq("id", teamId!)
          .single(),
        supabase
          .from("players")
          .select("name")
          .eq("id", playerId!)
          .single(),
        supabase
          .from("matches")
          .select("id")
          .eq("team_id", teamId!)
          .eq("status", "completed"),
      ]);

      const defaultMinutes = getDefaultMatchMinutes(teamRes.data?.team_type);
      if (!playerRes.data) return null;

      const matchIds = (matchesRes.data ?? []).map((m) => m.id);
      if (matchIds.length === 0) {
        return {
          playerId: playerId!,
          playerName: playerRes.data.name,
          matchesPlayed: 0,
          totalMinutes: 0,
          averageMinutes: 0,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
        };
      }

      // Parallel batch 2: queries depending on matchIds
      const [lineupsRes, statsRes] = await Promise.all([
        supabase
          .from("lineups")
          .select("match_id, substitution_plan, positions")
          .in("match_id", matchIds),
        supabase
          .from("match_stats")
          .select("player_id, goals, assists, yellow_cards, red_cards")
          .eq("player_id", playerId!)
          .in("match_id", matchIds),
      ]);

      const results = aggregatePlayerStats(
        [{ id: playerId!, name: playerRes.data.name }],
        lineupsRes.data ?? [],
        statsRes.data ?? [],
        defaultMinutes
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
      // Parallel batch 1: independent queries
      const [teamRes, playersRes, matchesRes] = await Promise.all([
        supabase
          .from("teams")
          .select("team_type")
          .eq("id", teamId!)
          .single(),
        supabase
          .from("players")
          .select("id, name")
          .eq("team_id", teamId!)
          .eq("is_active", true)
          .neq("role", "staff"),
        supabase
          .from("matches")
          .select("id")
          .eq("team_id", teamId!)
          .eq("status", "completed"),
      ]);

      const defaultMinutes = getDefaultMatchMinutes(teamRes.data?.team_type);
      const players = playersRes.data;
      if (!players?.length) return [];

      const matchIds = (matchesRes.data ?? []).map((m) => m.id);
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

      // Parallel batch 2: queries depending on matchIds
      const [lineupsRes, allStatsRes] = await Promise.all([
        supabase
          .from("lineups")
          .select("match_id, substitution_plan, positions")
          .in("match_id", matchIds),
        supabase
          .from("match_stats")
          .select("player_id, goals, assists, yellow_cards, red_cards")
          .in("match_id", matchIds),
      ]);

      return aggregatePlayerStats(
        players,
        lineupsRes.data ?? [],
        allStatsRes.data ?? [],
        defaultMinutes
      );
    },
    enabled: !!teamId,
  });
}
