"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type {
  PlayerAttendance,
  PlayerSeasonStats,
  TeamSeasonSummary,
} from "@/types";
import {
  aggregateAttendance,
  aggregatePlayerStats,
  aggregateTeamResults,
} from "@/lib/player-stats-utils";
import { TEAM_TYPE_CONFIG } from "@/lib/constants";

export interface TeamStats {
  playerStats: PlayerSeasonStats[];
  attendance: PlayerAttendance[];
  summary: TeamSeasonSummary;
}

function getDefaultMatchMinutes(teamType: string | null | undefined): number {
  const config = teamType ? TEAM_TYPE_CONFIG[teamType] : undefined;
  return config ? config.halfMinutes * config.halves : 90;
}

/**
 * All season data the team stats dashboard needs: per-player minutes and
 * stats, availability rates, and the team's W/D/L record.
 */
export function useTeamStats(teamId: string | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["team-stats", teamId],
    queryFn: async (): Promise<TeamStats> => {
      const [teamRes, playersRes, matchesRes] = await Promise.all([
        supabase.from("teams").select("team_type").eq("id", teamId!).single(),
        supabase
          .from("players")
          .select("id, name")
          .eq("team_id", teamId!)
          .eq("is_active", true)
          .neq("role", "staff"),
        supabase
          .from("matches")
          .select("id, home_away, score_home, score_away")
          .eq("team_id", teamId!)
          .eq("status", "completed"),
      ]);

      const players = playersRes.data ?? [];
      const matches = matchesRes.data ?? [];
      const matchIds = matches.map((m) => m.id);

      if (players.length === 0 || matchIds.length === 0) {
        return {
          playerStats: [],
          attendance: [],
          summary: aggregateTeamResults(matches),
        };
      }

      const [lineupsRes, statsRes, availabilityRes] = await Promise.all([
        supabase
          .from("lineups")
          .select("match_id, substitution_plan, positions")
          .in("match_id", matchIds),
        supabase
          .from("match_stats")
          .select("player_id, goals, assists, yellow_cards, red_cards")
          .in("match_id", matchIds),
        supabase
          .from("availability")
          .select("player_id, match_id, status")
          .in("match_id", matchIds),
      ]);

      return {
        playerStats: aggregatePlayerStats(
          players,
          lineupsRes.data ?? [],
          statsRes.data ?? [],
          getDefaultMatchMinutes(teamRes.data?.team_type)
        ),
        attendance: aggregateAttendance(
          players,
          availabilityRes.data ?? [],
          matchIds.length
        ),
        summary: aggregateTeamResults(matches),
      };
    },
    enabled: !!teamId,
  });
}
