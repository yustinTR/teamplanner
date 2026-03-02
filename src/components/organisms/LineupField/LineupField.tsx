"use client";

import { useRef, useState } from "react";
import { DndContext, type DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors, useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { Share2, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/animations";
import { useAuthStore } from "@/stores/auth-store";
import { usePlayers } from "@/hooks/use-players";
import { useAvailability } from "@/hooks/use-availability";
import { useMatchPlayers } from "@/hooks/use-match-players";
import { useLineup, useSaveLineup } from "@/hooks/use-lineup";
import { PitchPlayer } from "@/components/molecules/PitchPlayer";
import { BenchPlayer } from "@/components/molecules/BenchPlayer";
import { AnimatedList, AnimatedListItem } from "@/components/atoms/AnimatedList";
import { FormationSelector } from "@/components/molecules/FormationSelector";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { FORMATIONS, TEAM_TYPE_CONFIG, getFormationsForTeamType, getDefaultFormation, type PlayerSkills } from "@/lib/constants";
import { generateSubstitutionPlan, type SubstituteSuggestion, matchPlayerToPlayer } from "@/lib/lineup-generator";
import { ensureEafcFormat, calculateOverallRating, getCardTier, hasEafcSkills } from "@/lib/player-rating";
import { SubstitutionPlanEditor } from "@/components/organisms/SubstitutionPlanEditor";
import { ShareLineupCard } from "@/components/molecules/ShareLineupCard";
import { useShareImage } from "@/hooks/use-share-image";
import type { LineupPosition, AvailabilityWithPlayer, Player, SubstitutionPlan, Availability, MatchPlayer, Team } from "@/types";

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

interface LineupFieldProps {
  matchId: string;
  matchOpponent?: string;
  matchDate?: string;
}

// Outer component: fetches data and shows loading state.
// Inner editor only mounts after data is loaded, so useState initializers
// get the correct values from existingLineup.
export function LineupField({ matchId, matchOpponent, matchDate }: LineupFieldProps) {
  const { currentTeam } = useAuthStore();
  const { data: players, isLoading: playersLoading } = usePlayers(currentTeam?.id);
  const { data: availability } = useAvailability(matchId);
  const { data: matchPlayersData } = useMatchPlayers(matchId);
  const { data: existingLineup, isLoading: lineupLoading } = useLineup(matchId);

  if (playersLoading || lineupLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <LineupFieldEditor
      matchId={matchId}
      matchOpponent={matchOpponent}
      matchDate={matchDate}
      currentTeam={currentTeam ?? null}
      players={players ?? []}
      availability={availability ?? []}
      matchPlayersData={matchPlayersData ?? []}
      existingLineup={existingLineup ?? null}
    />
  );
}

interface LineupFieldEditorProps {
  matchId: string;
  matchOpponent?: string;
  matchDate?: string;
  currentTeam: Team | null;
  players: Player[];
  availability: Availability[];
  matchPlayersData: MatchPlayer[];
  existingLineup: {
    formation: string | null;
    positions: unknown;
    substitution_plan: unknown;
  } | null;
}

function LineupFieldEditor({
  matchId,
  matchOpponent,
  matchDate,
  currentTeam,
  players,
  availability,
  matchPlayersData,
  existingLineup,
}: LineupFieldEditorProps) {
  const saveLineup = useSaveLineup();
  const shareRef = useRef<HTMLDivElement>(null);
  const { share, isGenerating } = useShareImage();
  const [isSaved, setIsSaved] = useState(!!existingLineup);

  const teamType = currentTeam?.team_type ?? "senioren";
  const defaultFormation = getDefaultFormation(teamType);
  const teamFormations = getFormationsForTeamType(teamType);

  const [formation, setFormation] = useState(
    existingLineup?.formation ?? defaultFormation
  );
  const [positions, setPositions] = useState<LineupPosition[]>(
    () => (existingLineup?.positions as unknown as LineupPosition[]) ?? []
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [substitutes, setSubstitutes] = useState<SubstituteSuggestion[]>([]);
  const [substitutionPlan, setSubstitutionPlan] = useState<SubstitutionPlan | null>(
    () => (existingLineup?.substitution_plan as unknown as SubstitutionPlan) ?? null
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    })
  );

  // Available players for the bench
  const availablePlayerIds = new Set(
    availability
      .filter((a) => a.status === "available" || a.status === "maybe")
      .map((a) => a.player_id)
  );

  const assignedPlayerIds = new Set(positions.map((p) => p.player_id));

  // Convert match players to Player-like objects for the bench
  const matchPlayersList: Player[] = matchPlayersData.map(matchPlayerToPlayer);

  const benchPlayers = [
    ...players.filter(
      (p) => availablePlayerIds.has(p.id) && !assignedPlayerIds.has(p.id) && p.role !== "staff"
    ),
    ...matchPlayersList.filter((p) => !assignedPlayerIds.has(p.id)),
  ];

  const allPlayersForMap: Player[] = [...players, ...matchPlayersList];
  const playerMap = new Map(allPlayersForMap.map((p) => [p.id, p]));

  const formationSlots = FORMATIONS[formation] ?? teamFormations[defaultFormation];

  function handleFormationChange(newFormation: string) {
    setFormation(newFormation);
    // Reset positions when changing formation
    const newSlots = teamFormations[newFormation] ?? FORMATIONS[newFormation] ?? [];
    const newPositions: LineupPosition[] = newSlots.map((slot, i) => {
      const existing = positions[i];
      return existing
        ? { ...existing, x: slot.x, y: slot.y, position_label: slot.position_label }
        : { player_id: "", x: slot.x, y: slot.y, position_label: slot.position_label };
    });
    setPositions(newPositions);
    setHasChanges(true);
  }

  function handleAutoLineup() {
    const availablePlayers = [
      ...players.filter((p) => availablePlayerIds.has(p.id) && p.role !== "staff"),
      ...matchPlayersList,
    ];

    const config = TEAM_TYPE_CONFIG[teamType];

    const result = generateSubstitutionPlan(
      formation,
      availablePlayers,
      availability as AvailabilityWithPlayer[],
      config
    );
    setPositions(result.positions);
    setSubstitutes(result.substitutes);
    setSubstitutionPlan(result.substitutionPlan);
    setHasChanges(true);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const dragId = String(active.id);
    const dropSlotIndex = Number(over.id);
    if (isNaN(dropSlotIndex)) return;

    const slot = formationSlots[dropSlotIndex];
    if (!slot) return;

    // Get the player ID
    let playerId: string;
    if (dragId.startsWith("bench-")) {
      playerId = dragId.replace("bench-", "");
    } else {
      // Moving from one position to another
      const existingPos = positions.find((p) => p.player_id === dragId);
      if (!existingPos) return;
      playerId = existingPos.player_id;
    }

    const newPositions = [...positions];
    // Remove from existing position if already assigned
    const existingIndex = newPositions.findIndex(
      (p) => p.player_id === playerId
    );
    if (existingIndex >= 0) {
      newPositions.splice(existingIndex, 1);
    }

    // Remove anyone already in this slot
    const slotIndex = newPositions.findIndex(
      (p) => p.x === slot.x && p.y === slot.y
    );
    if (slotIndex >= 0) {
      newPositions.splice(slotIndex, 1);
    }

    newPositions.push({
      player_id: playerId,
      x: slot.x,
      y: slot.y,
      position_label: slot.position_label,
    });

    setPositions(newPositions);
    setHasChanges(true);
  }

  async function handleSave() {
    await saveLineup.mutateAsync({
      matchId,
      formation,
      positions: positions.filter((p) => p.player_id),
      substitutionPlan,
    });
    setHasChanges(false);
    setIsSaved(true);
  }

  // Build share data
  const sharePlayers = positions
    .filter((p) => p.player_id)
    .map((pos) => {
      const player = playerMap.get(pos.player_id);
      const slot = formationSlots.find(
        (s) => s.x === pos.x && s.y === pos.y
      );
      const posLabel = slot?.position_label ?? pos.position_label ?? "";
      let cardProps: {
        overall?: number;
        cardTier?: ReturnType<typeof getCardTier>;
      } = {};
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

  const benchPlayerNames = benchPlayers.map(
    (p) => p.name.split(" ").pop() ?? p.name
  );

  const shareSubstitutions =
    substitutionPlan?.substitutionMoments?.map((m) => ({
      minute: m.minute,
      changes: m.out.map((outP, i) => ({
        outName: outP.name,
        inName: m.in[i]?.name ?? "?",
        position: outP.position_label,
      })),
    })) ?? [];

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FormationSelector value={formation} onChange={handleFormationChange} teamType={teamType} />
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5"
            onClick={handleAutoLineup}
            disabled={!players.length}
          >
            <Wand2 className="size-4" />
            Auto
          </Button>
        </div>

        {/* Pitch */}
        <div className="relative aspect-[68/105] w-full overflow-hidden rounded-lg bg-green-600">
          {/* Field markings */}
          <div className="absolute inset-2 rounded-md border-2 border-white/40" />
          <div className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-white/40" />
          <div className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/40" />
          {/* Penalty areas */}
          <div className="absolute inset-x-[20%] top-2 h-[18%] border-2 border-t-0 border-white/40" />
          <div className="absolute inset-x-[20%] bottom-2 h-[18%] border-2 border-b-0 border-white/40" />

          {/* Drop zones for formation positions */}
          {formationSlots.map((slot, index) => {
            const assignedPlayer = positions.find(
              (p) => p.x === slot.x && p.y === slot.y && p.player_id
            );
            const player = assignedPlayer
              ? playerMap.get(assignedPlayer.player_id)
              : null;

            return (
              <DropZone key={index} id={index} x={slot.x} y={slot.y}>
                {player ? (
                  <PitchPlayer
                    id={player.id}
                    name={player.name}
                    jerseyNumber={player.jersey_number}
                    positionLabel={slot.position_label}
                    x={50}
                    y={50}
                    draggable
                    {...getPlayerCardProps(player, slot.position_label)}
                  />
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-full border-2 border-dashed border-white/60 bg-white/10 text-xs text-white/80">
                    {slot.position_label}
                  </div>
                )}
              </DropZone>
            );
          })}
        </div>

        {/* Bench */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            Bank ({benchPlayers.length})
          </h3>
          <AnimatedList className="grid grid-cols-2 gap-2">
            {benchPlayers.map((player) => (
              <AnimatedListItem key={player.id}>
                <BenchPlayer
                  id={player.id}
                  name={player.name}
                  jerseyNumber={player.jersey_number}
                  photoUrl={player.photo_url}
                  draggable
                />
              </AnimatedListItem>
            ))}
          </AnimatedList>
        </div>

        {/* Substitute suggestions */}
        {substitutes.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              Wissels ({substitutes.length})
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {substitutes.map((sub) => (
                <div
                  key={sub.player.id}
                  className="flex min-h-[44px] items-center gap-2 rounded-lg border px-3 py-2"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {sub.player.name}
                  </span>
                  <Badge
                    variant={
                      sub.compatibility === "exact"
                        ? "available"
                        : sub.compatibility === "related"
                          ? "maybe"
                          : "default"
                    }
                    label={sub.position_label}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Substitution Plan Editor */}
        {(substitutionPlan || benchPlayers.length > 0) && positions.some(p => p.player_id) && (
          <SubstitutionPlanEditor
            substitutionPlan={substitutionPlan}
            positions={positions.filter(p => p.player_id)}
            benchPlayers={benchPlayers}
            playerMap={playerMap}
            teamType={teamType}
            onChange={(plan) => { setSubstitutionPlan(plan); setHasChanges(true); }}
          />
        )}

        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring.bouncy}
          >
            <Button
              className="w-full"
              onClick={handleSave}
              disabled={saveLineup.isPending}
            >
              {saveLineup.isPending ? "Opslaan..." : "Opstelling opslaan"}
            </Button>
          </motion.div>
        )}

        {isSaved && !hasChanges && positions.some((p) => p.player_id) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring.bouncy}
            className="space-y-2"
          >
            <p className="text-center text-sm text-muted-foreground">
              Opstelling opgeslagen. Sleep spelers om te wijzigen.
            </p>
            {matchOpponent && (
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() =>
                  shareRef.current &&
                  share(shareRef.current, `opstelling-${matchId}`)
                }
                disabled={isGenerating}
              >
                <Share2 className="size-4" />
                {isGenerating ? "Genereren..." : "Deel opstelling"}
              </Button>
            )}
          </motion.div>
        )}

        {/* Hidden share card */}
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
                substitutions={shareSubstitutions}
              />
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
}

// Simple droppable zone component
function DropZone({
  id,
  x,
  y,
  children,
}: {
  id: number;
  x: number;
  y: number;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center",
        isOver && "scale-110"
      )}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {children}
    </div>
  );
}
