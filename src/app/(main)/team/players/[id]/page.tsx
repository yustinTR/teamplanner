"use client";

import { use } from "react";
import { PlayerDetail } from "@/components/organisms/PlayerDetail";

interface PlayerPageProps {
  params: Promise<{ id: string }>;
}

export default function PlayerPage({ params }: PlayerPageProps) {
  const { id } = use(params);
  return <PlayerDetail playerId={id} />;
}
