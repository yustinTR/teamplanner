"use client";

import type { PlayerAttendance } from "@/types";

interface AttendanceOverviewProps {
  attendance: PlayerAttendance[];
}

export function AttendanceOverview({ attendance }: AttendanceOverviewProps) {
  if (attendance.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Nog geen beschikbaarheid doorgegeven.
      </p>
    );
  }

  const sorted = [...attendance].sort(
    (a, b) => b.availableRate - a.availableRate || b.responseRate - a.responseRate
  );

  return (
    <div>
      <ul className="space-y-3">
        {sorted.map((player) => (
          <li key={player.playerId}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate text-sm font-medium">
                {player.playerName}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {player.availableRate}% beschikbaar · {player.responseRate}%
                gereageerd
              </span>
            </div>
            <div
              className="mt-1 h-2 overflow-hidden rounded-full bg-neutral-100"
              role="progressbar"
              aria-valuenow={player.availableRate}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${player.playerName}: ${player.availableRate}% beschikbaar`}
            >
              {/* Response rate as light track, availability as solid fill */}
              <div className="relative h-full">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary-200"
                  style={{ width: `${player.responseRate}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary-600"
                  style={{ width: `${player.availableRate}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Donkergroen: beschikbaar gemeld. Lichtgroen: wel gereageerd.
      </p>
    </div>
  );
}
