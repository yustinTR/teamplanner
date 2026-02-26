"use client";

import { useMemo } from "react";
import { useLineup } from "@/hooks/use-lineup";
import { useMatchStats, useSaveMatchStats } from "@/hooks/use-match-stats";
import { MatchStatsForm } from "@/components/molecules/MatchStatsForm";
import type { PlayerStatRow } from "@/components/molecules/MatchStatsForm";
import { Spinner } from "@/components/atoms/Spinner";
import type { SubstitutionPlan } from "@/types/lineup";

interface MatchStatsEditorProps {
  matchId: string;
}

export function MatchStatsEditor({ matchId }: MatchStatsEditorProps) {
  const { data: lineup, isLoading: lineupLoading } = useLineup(matchId);
  const { data: existingStats, isLoading: statsLoading } =
    useMatchStats(matchId);
  const saveStats = useSaveMatchStats();

  const players = useMemo(() => {
    if (!lineup?.substitution_plan) return [];
    const plan =
      lineup.substitution_plan as unknown as SubstitutionPlan | null;
    if (!plan?.playerMinutes) return [];
    return plan.playerMinutes.map((pm) => ({
      id: pm.player_id,
      name: pm.name,
    }));
  }, [lineup]);

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

  if (lineupLoading || statsLoading) {
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
