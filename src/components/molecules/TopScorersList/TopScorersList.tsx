"use client";

import { Avatar } from "@/components/atoms/Avatar";
import type { PlayerSeasonStats } from "@/types";

interface TopScorersListProps {
  stats: PlayerSeasonStats[];
  /** Which stat to rank on */
  statKey: "goals" | "assists";
  limit?: number;
}

const LABELS: Record<TopScorersListProps["statKey"], string> = {
  goals: "doelpunten",
  assists: "assists",
};

export function TopScorersList({
  stats,
  statKey,
  limit = 5,
}: TopScorersListProps) {
  const ranked = [...stats]
    .filter((s) => s[statKey] > 0)
    .sort((a, b) => b[statKey] - a[statKey])
    .slice(0, limit);

  if (ranked.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Nog geen {LABELS[statKey]} geregistreerd.
      </p>
    );
  }

  return (
    <ol className="divide-y divide-neutral-100">
      {ranked.map((player, index) => (
        <li
          key={player.playerId}
          className="flex min-h-[44px] items-center gap-3 py-2"
        >
          <span className="w-5 text-center text-sm font-semibold text-muted-foreground">
            {index + 1}
          </span>
          <Avatar fallback={player.playerName} size="sm" />
          <span className="flex-1 truncate text-sm font-medium">
            {player.playerName}
          </span>
          <span className="text-sm font-bold text-primary-700">
            {player[statKey]}
          </span>
        </li>
      ))}
    </ol>
  );
}
