"use client";

import { usePlayerSeasonStats } from "@/hooks/use-player-stats";
import { PlayerStatsSummary } from "@/components/molecules/PlayerStatsSummary";
import { Spinner } from "@/components/atoms/Spinner";

interface PlayerStatsSectionProps {
  playerId: string;
  teamId: string;
}

export function PlayerStatsSection({
  playerId,
  teamId,
}: PlayerStatsSectionProps) {
  const { data: stats, isLoading } = usePlayerSeasonStats(playerId, teamId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner />
      </div>
    );
  }

  if (!stats || stats.matchesPlayed === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">
        Seizoensstatistieken
      </h2>
      <PlayerStatsSummary
        matchesPlayed={stats.matchesPlayed}
        totalMinutes={stats.totalMinutes}
        averageMinutes={stats.averageMinutes}
        goals={stats.goals}
        assists={stats.assists}
        yellowCards={stats.yellowCards}
        redCards={stats.redCards}
      />
    </div>
  );
}
