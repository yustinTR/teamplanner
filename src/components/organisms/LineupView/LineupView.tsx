"use client";

import { useRef } from "react";
import { useLineup } from "@/hooks/use-lineup";
import { usePlayers } from "@/hooks/use-players";
import { useMatchPlayers } from "@/hooks/use-match-players";
import { useAvailability } from "@/hooks/use-availability";
import { useAuthStore } from "@/stores/auth-store";
import { matchPlayerToPlayer } from "@/lib/lineup-generator";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/atoms/EmptyState";
import { Button } from "@/components/atoms/Button";
import { PitchPlayer } from "@/components/molecules/PitchPlayer";
import { ShareLineupCard } from "@/components/molecules/ShareLineupCard";
import { ClipboardList, Share2 } from "lucide-react";
import { FORMATIONS, type PlayerSkills } from "@/lib/constants";
import { ensureEafcFormat, calculateOverallRating, getCardTier, hasEafcSkills, type CardTier } from "@/lib/player-rating";
import { useShareImage } from "@/hooks/use-share-image";
import { SubstitutionPlan as SubstitutionPlanView } from "@/components/organisms/SubstitutionPlan";
import type { LineupPosition, SubstitutionPlan as SubstitutionPlanType, Player } from "@/types";

function getPlayerCardProps(player: Player, positionLabel: string) {
  const rawSkills = (player.skills as PlayerSkills) ?? {};
  if (!hasEafcSkills(rawSkills)) return {};
  const eafcSkills = ensureEafcFormat(rawSkills);
  const overall = calculateOverallRating(eafcSkills, positionLabel);
  return {
    overall,
    cardTier: getCardTier(overall),
    photoUrl: player.photo_url,
  };
}

interface LineupViewProps {
  matchId: string;
  matchOpponent?: string;
  matchDate?: string;
}

export function LineupView({ matchId, matchOpponent, matchDate }: LineupViewProps) {
  const shareRef = useRef<HTMLDivElement>(null);
  const { share, isGenerating } = useShareImage();
  const { currentTeam } = useAuthStore();
  const { data: lineup, isLoading } = useLineup(matchId);
  const { data: players } = usePlayers(currentTeam?.id);
  const { data: matchPlayersData } = useMatchPlayers(matchId);
  const { data: availability } = useAvailability(matchId);

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

  // Build share player data
  const positionPlayerIds = new Set(positions.map((p) => p.player_id));
  const sharePlayers = positions.map((pos) => {
    const player = playerMap.get(pos.player_id);
    const slot = formationSlots.find((s) => s.x === pos.x && s.y === pos.y);
    const posLabel = slot?.position_label ?? "";
    let cardProps: { overall?: number; cardTier?: CardTier } = {};
    if (player) {
      const rawSkills = (player.skills as PlayerSkills) ?? {};
      if (hasEafcSkills(rawSkills)) {
        const eafcSkills = ensureEafcFormat(rawSkills);
        const overall = calculateOverallRating(eafcSkills, posLabel);
        cardProps = { overall, cardTier: getCardTier(overall) };
      }
    }
    return {
      name: player?.name ?? "?",
      positionLabel: posLabel,
      x: pos.x,
      y: pos.y,
      overall: cardProps.overall ?? null,
      cardTier: cardProps.cardTier ?? null,
    };
  });

  // Build bench names: available players not in the starting lineup
  const availablePlayers = (availability ?? []).filter(
    (a) => a.status === "available" && !positionPlayerIds.has(a.player_id)
  );
  const benchPlayerNames = availablePlayers
    .map((a) => a.players?.name)
    .filter((name): name is string => !!name);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Formatie: {formation}</p>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={() =>
            shareRef.current &&
            share(shareRef.current, `opstelling-${matchId}`)
          }
          disabled={isGenerating || !matchOpponent}
        >
          <Share2 className="size-4" />
          {isGenerating ? "Genereren..." : "Delen"}
        </Button>
      </div>

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

          return player ? (
            <PitchPlayer
              key={index}
              id={`view-${player.id}`}
              name={player.name}
              jerseyNumber={player.jersey_number}
              positionLabel={slot.position_label}
              x={slot.x}
              y={slot.y}
              {...getPlayerCardProps(player, slot.position_label)}
            />
          ) : (
            <div
              key={index}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              <div className="flex size-10 items-center justify-center rounded-full border-2 border-dashed border-white/60 bg-white/10 text-xs text-white/80">
                {slot.position_label}
              </div>
            </div>
          );
        })}
      </div>

      {lineup.substitution_plan && (
        <SubstitutionPlanView plan={lineup.substitution_plan as unknown as SubstitutionPlanType} />
      )}

      {/* Hidden share card for html2canvas */}
      {matchOpponent && matchDate && (
        <div className="fixed -left-[9999px] top-0">
          <div ref={shareRef}>
            <ShareLineupCard
              teamName={currentTeam?.name ?? "Team"}
              opponent={matchOpponent}
              matchDate={matchDate}
              formation={formation}
              players={sharePlayers}
              benchNames={benchPlayerNames}
            />
          </div>
        </div>
      )}
    </div>
  );
}
