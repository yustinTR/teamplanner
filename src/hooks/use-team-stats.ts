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
import { availableSeasons, currentSeason, isInSeason } from "@/lib/season";

export interface TeamStats {
  /** The season the numbers below belong to (start year). */
  season: number;
  /** Seasons that have completed matches, plus the current one, newest first. */
  seasons: number[];
  playerStats: PlayerSeasonStats[];
  attendance: PlayerAttendance[];
  summary: TeamSeasonSummary;
}

function getDefaultMatchMinutes(teamType: string | null | undefined): number {
  const config = teamType ? TEAM_TYPE_CONFIG[teamType] : undefined;
  return config ? config.halfMinutes * config.halves : 90;
}

/**
 * All data the team stats dashboard needs for one season (August–July):
 * per-player minutes and stats, availability rates, and the W/D/L record.
 * Defaults to the current season.
 */
export function useTeamStats(teamId: string | undefined, season?: number) {
  const supabase = createClient();
  const selectedSeason = season ?? currentSeason();

  return useQuery({
    queryKey: ["team-stats", teamId, selectedSeason],
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
          .select("id, match_date, home_away, score_home, score_away")
          .eq("team_id", teamId!)
          .eq("status", "completed"),
      ]);

      const players = playersRes.data ?? [];
      const allMatches = matchesRes.data ?? [];
      const seasons = availableSeasons(allMatches.map((m) => m.match_date));
      const matches = allMatches.filter((m) =>
        isInSeason(m.match_date, selectedSeason)
      );
      const matchIds = matches.map((m) => m.id);

      if (players.length === 0 || matchIds.length === 0) {
        return {
          season: selectedSeason,
          seasons,
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
        season: selectedSeason,
        seasons,
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
