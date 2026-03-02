"use client";

import { useMemo } from "react";
import { useLineup } from "@/hooks/use-lineup";
import { useMatchStats, useSaveMatchStats } from "@/hooks/use-match-stats";
import { usePlayers } from "@/hooks/use-players";
import { useMatchPlayers } from "@/hooks/use-match-players";
import { useAuthStore } from "@/stores/auth-store";
import { matchPlayerToPlayer } from "@/lib/lineup-generator";
import { MatchStatsForm } from "@/components/molecules/MatchStatsForm";
import type { PlayerStatRow } from "@/components/molecules/MatchStatsForm";
import { Spinner } from "@/components/atoms/Spinner";
import type { SubstitutionPlan } from "@/types/lineup";
import type { LineupPosition } from "@/types";

interface MatchStatsEditorProps {
  matchId: string;
}

export function MatchStatsEditor({ matchId }: MatchStatsEditorProps) {
  const { currentTeam } = useAuthStore();
  const { data: lineup, isLoading: lineupLoading } = useLineup(matchId);
  const { data: existingStats, isLoading: statsLoading } =
    useMatchStats(matchId);
  const { data: allPlayers, isLoading: playersLoading } = usePlayers(currentTeam?.id);
  const { data: matchPlayersData } = useMatchPlayers(matchId);
  const saveStats = useSaveMatchStats();

  const players = useMemo(() => {
    // First try: substitution plan playerMinutes (has names)
    if (lineup?.substitution_plan) {
      const plan =
        lineup.substitution_plan as unknown as SubstitutionPlan | null;
      if (plan?.playerMinutes?.length) {
        return plan.playerMinutes.map((pm) => ({
          id: pm.player_id,
          name: pm.name,
        }));
      }
    }

    // Fallback: lineup positions + player lookup
    if (lineup?.positions) {
      const positions = lineup.positions as unknown as LineupPosition[];
      const matchPlayersList = (matchPlayersData ?? []).map(matchPlayerToPlayer);
      const playerMap = new Map([
        ...(allPlayers ?? []).map((p) => [p.id, p.name] as const),
        ...matchPlayersList.map((p) => [p.id, p.name] as const),
      ]);
      return positions
        .filter((p) => p.player_id)
        .map((p) => ({
          id: p.player_id,
          name: playerMap.get(p.player_id) ?? "Onbekend",
        }));
    }

    return [];
  }, [lineup, allPlayers, matchPlayersData]);

  const initialStats: PlayerStatRow[] | undefined = useMemo(() => {
    if (!existingStats?.length) return undefined;
    return existingStats.map((s) => ({
      playerId: s.player_id,
      playerName:
        (s.players as unknown as { name: string } | null)?.name ?? "",
      goals: s.goals,
      assists: s.assists,
      yellowCards: s.yellow_cards,
      redCards: s.red_cards,
    }));
  }, [existingStats]);

  if (lineupLoading || statsLoading || playersLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner />
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Maak eerst een opstelling aan om statistieken in te voeren.
      </p>
    );
  }

  async function handleSubmit(rows: PlayerStatRow[]) {
    await saveStats.mutateAsync({
      matchId,
      stats: rows.map((r) => ({
        match_id: matchId,
        player_id: r.playerId,
        goals: r.goals,
        assists: r.assists,
        yellow_cards: r.yellowCards,
        red_cards: r.redCards,
      })),
    });
  }

  return (
    <MatchStatsForm
      players={players}
      initialStats={initialStats}
      onSubmit={handleSubmit}
    />
  );
}
