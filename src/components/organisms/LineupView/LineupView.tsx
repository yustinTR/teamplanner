"use client";

import { useLineup } from "@/hooks/use-lineup";
import { usePlayers } from "@/hooks/use-players";
import { useMatchPlayers } from "@/hooks/use-match-players";
import { useAuthStore } from "@/stores/auth-store";
import { matchPlayerToPlayer } from "@/lib/lineup-generator";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/atoms/EmptyState";
import { ClipboardList } from "lucide-react";
import { FORMATIONS } from "@/lib/constants";
import type { LineupPosition } from "@/types";

interface LineupViewProps {
  matchId: string;
}

export function LineupView({ matchId }: LineupViewProps) {
  const { currentTeam } = useAuthStore();
  const { data: lineup, isLoading } = useLineup(matchId);
  const { data: players } = usePlayers(currentTeam?.id);
  const { data: matchPlayersData } = useMatchPlayers(matchId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (!lineup || !(lineup.positions as unknown as LineupPosition[])?.length) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Nog geen opstelling"
        description="De coach heeft nog geen opstelling gemaakt."
      />
    );
  }

  const positions = lineup.positions as unknown as LineupPosition[];
  const formation = lineup.formation ?? "4-3-3";
  const formationSlots = FORMATIONS[formation] ?? FORMATIONS["4-3-3"];
  const matchPlayersList = (matchPlayersData ?? []).map(matchPlayerToPlayer);
  const allPlayers = [...(players ?? []), ...matchPlayersList];
  const playerMap = new Map(allPlayers.map((p) => [p.id, p]));

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Formatie: {formation}</p>

      <div className="relative aspect-[68/105] w-full overflow-hidden rounded-lg bg-green-600">
        {/* Field markings */}
        <div className="absolute inset-2 rounded-md border-2 border-white/40" />
        <div className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-white/40" />
        <div className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/40" />
        <div className="absolute inset-x-[20%] top-2 h-[18%] border-2 border-t-0 border-white/40" />
        <div className="absolute inset-x-[20%] bottom-2 h-[18%] border-2 border-b-0 border-white/40" />

        {/* Players on positions */}
        {formationSlots.map((slot, index) => {
          const pos = positions.find(
            (p) => p.x === slot.x && p.y === slot.y
          );
          const player = pos ? playerMap.get(pos.player_id) : null;

          return (
            <div
              key={index}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              {player ? (
                <>
                  <div className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-bold text-primary-foreground shadow-md">
                    {player.jersey_number ?? slot.position_label}
                  </div>
                  <span className="mt-0.5 max-w-[60px] truncate text-center text-[10px] font-medium text-white drop-shadow-md">
                    {player.name}
                  </span>
                </>
              ) : (
                <div className="flex size-10 items-center justify-center rounded-full border-2 border-dashed border-white/60 bg-white/10 text-xs text-white/80">
                  {slot.position_label}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
