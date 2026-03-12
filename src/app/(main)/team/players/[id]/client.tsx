"use client";

import { PlayerDetail } from "@/components/organisms/PlayerDetail";

interface PlayerDetailClientProps {
  playerId: string;
}

export function PlayerDetailClient({ playerId }: PlayerDetailClientProps) {
  return <PlayerDetail playerId={playerId} />;
}
