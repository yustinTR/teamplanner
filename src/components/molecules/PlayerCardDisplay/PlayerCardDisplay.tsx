"use client";

import { PlayerCard } from "@/components/atoms/PlayerCard";
import type { Player } from "@/types";
import type { PlayerSkills } from "@/lib/constants";
import {
  ensureEafcFormat,
  calculateOverallRating,
  calculateSixStats,
  getCardTier,
  hasEafcSkills,
} from "@/lib/player-rating";

interface PlayerCardDisplayProps {
  player: Player;
  teamName?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PlayerCardDisplay({
  player,
  teamName,
  size = "md",
  className,
}: PlayerCardDisplayProps) {
  const rawSkills = (player.skills as PlayerSkills) ?? {};
  const hasSkills = hasEafcSkills(rawSkills);
  const eafcSkills = hasSkills ? ensureEafcFormat(rawSkills) : {};

  const overall = hasSkills
    ? calculateOverallRating(eafcSkills, player.primary_position)
    : null;
  const stats = hasSkills ? calculateSixStats(eafcSkills) : undefined;
  const tier = overall != null ? getCardTier(overall) : "bronze";

  return (
    <PlayerCard
      name={player.name}
      teamName={teamName}
      position={player.primary_position ?? "SUB"}
      overall={overall ?? 0}
      photoUrl={player.photo_url}
      jerseyNumber={player.jersey_number}
      stats={stats}
      tier={tier}
      size={size}
      className={className}
    />
  );
}
