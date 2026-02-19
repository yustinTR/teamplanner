"use client";

import { useAuthStore } from "@/stores/auth-store";
import { usePlayers } from "@/hooks/use-players";
import { useAvailability, useAvailabilityRealtime, useSetAvailability } from "@/hooks/use-availability";
import { PlayerAvailabilityRow } from "@/components/molecules/PlayerAvailabilityRow";
import { AvailabilitySummary } from "@/components/molecules/AvailabilitySummary";
import { AvailabilityToggle } from "@/components/molecules/AvailabilityToggle";
import { Spinner } from "@/components/atoms/Spinner";
import type { AvailabilityStatus, Player } from "@/types";

interface AvailabilityGridProps {
  matchId: string;
}

export function AvailabilityGrid({ matchId }: AvailabilityGridProps) {
  const { currentTeam, isCoach } = useAuthStore();
  const { data: players, isLoading: playersLoading } = usePlayers(currentTeam?.id);
  const { data: availability, isLoading: availabilityLoading } = useAvailability(matchId);
  const setAvailability = useSetAvailability();

  useAvailabilityRealtime(matchId);

  if (playersLoading || availabilityLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (!players?.length) return null;

  const statusMap = new Map(
    availability?.map((a) => [a.player_id, a.status]) ?? []
  );

  const groups: Record<string, Player[]> = {
    available: [],
    maybe: [],
    unavailable: [],
    none: [],
  };

  for (const player of players) {
    const status = statusMap.get(player.id);
    if (status) {
      groups[status].push(player);
    } else {
      groups.none.push(player);
    }
  }

  const availableCount = groups.available.length;
  const unavailableCount = groups.unavailable.length;
  const maybeCount = groups.maybe.length;

  const sectionLabels: Record<string, string> = {
    available: "Beschikbaar",
    maybe: "Misschien",
    unavailable: "Afwezig",
    none: "Geen reactie",
  };

  function handleCoachSetAvailability(playerId: string, status: AvailabilityStatus) {
    setAvailability.mutate({ playerId, matchId, status });
  }

  return (
    <div className="space-y-4">
      <AvailabilitySummary
        available={availableCount}
        unavailable={unavailableCount}
        maybe={maybeCount}
      />

      {(["available", "maybe", "unavailable", "none"] as const).map((group) => {
        const groupPlayers = groups[group];
        if (!groupPlayers.length) return null;

        return (
          <div key={group}>
            <h3 className="mb-1 text-sm font-medium text-muted-foreground">
              {sectionLabels[group]} ({groupPlayers.length})
            </h3>
            <div className="divide-y">
              {groupPlayers.map((player) => (
                <div key={player.id}>
                  <PlayerAvailabilityRow
                    name={player.name}
                    photoUrl={player.photo_url}
                    status={statusMap.get(player.id) ?? null}
                  />
                  {isCoach && !player.user_id && (
                    <div className="pb-2 pl-11">
                      <AvailabilityToggle
                        value={statusMap.get(player.id) ?? null}
                        onChange={(status) =>
                          handleCoachSetAvailability(player.id, status)
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
