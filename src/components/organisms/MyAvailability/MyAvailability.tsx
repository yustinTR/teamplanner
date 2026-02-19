"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useAvailability, useSetAvailability } from "@/hooks/use-availability";
import { AvailabilityToggle } from "@/components/molecules/AvailabilityToggle";

interface MyAvailabilityProps {
  matchId: string;
}

export function MyAvailability({ matchId }: MyAvailabilityProps) {
  const { currentPlayer } = useAuthStore();
  const { data: availability } = useAvailability(matchId);
  const setAvailability = useSetAvailability();

  if (!currentPlayer) return null;

  const myStatus = availability?.find(
    (a) => a.player_id === currentPlayer.id
  )?.status ?? null;

  return (
    <div>
      <h2 className="mb-2 text-sm font-medium">Jouw beschikbaarheid</h2>
      <AvailabilityToggle
        value={myStatus}
        onChange={(status) =>
          setAvailability.mutate({
            playerId: currentPlayer.id,
            matchId,
            status,
          })
        }
        disabled={setAvailability.isPending}
      />
    </div>
  );
}
