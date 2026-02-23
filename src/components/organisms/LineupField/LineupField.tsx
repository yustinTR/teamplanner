"use client";

import { useState } from "react";
import { DndContext, type DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Wand2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { usePlayers } from "@/hooks/use-players";
import { useAvailability } from "@/hooks/use-availability";
import { useMatchPlayers } from "@/hooks/use-match-players";
import { useLineup, useSaveLineup } from "@/hooks/use-lineup";
import { PitchPlayer } from "@/components/molecules/PitchPlayer";
import { BenchPlayer } from "@/components/molecules/BenchPlayer";
import { FormationSelector } from "@/components/molecules/FormationSelector";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { FORMATIONS, TEAM_TYPE_CONFIG, getFormationsForTeamType, getDefaultFormation } from "@/lib/constants";
import { generateSubstitutionPlan, type SubstituteSuggestion, matchPlayerToPlayer } from "@/lib/lineup-generator";
import { SubstitutionPlan as SubstitutionPlanView } from "@/components/organisms/SubstitutionPlan";
import type { LineupPosition, AvailabilityWithPlayer, Player, SubstitutionPlan } from "@/types";

interface LineupFieldProps {
  matchId: string;
}

export function LineupField({ matchId }: LineupFieldProps) {
  const { currentTeam } = useAuthStore();
  const { data: players, isLoading: playersLoading } = usePlayers(currentTeam?.id);
  const { data: availability } = useAvailability(matchId);
  const { data: matchPlayersData } = useMatchPlayers(matchId);
  const { data: existingLineup, isLoading: lineupLoading } = useLineup(matchId);
  const saveLineup = useSaveLineup();

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
  const [substitutionPlan, setSubstitutionPlan] = useState<SubstitutionPlan | null>(null);

  // Update state when lineup loads
  useState(() => {
    if (existingLineup) {
      setFormation(existingLineup.formation ?? defaultFormation);
      setPositions(
        (existingLineup.positions as unknown as LineupPosition[]) ?? []
      );
    }
  });

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
      ?.filter((a) => a.status === "available" || a.status === "maybe")
      .map((a) => a.player_id) ?? []
  );

  const assignedPlayerIds = new Set(positions.map((p) => p.player_id));

  // Convert match players to Player-like objects for the bench
  const matchPlayersList: Player[] = (matchPlayersData ?? []).map(matchPlayerToPlayer);

  const benchPlayers = [
    ...(players ?? []).filter(
      (p) => availablePlayerIds.has(p.id) && !assignedPlayerIds.has(p.id) && p.role !== "staff"
    ),
    ...matchPlayersList.filter((p) => !assignedPlayerIds.has(p.id)),
  ];

  const allPlayersForMap: Player[] = [...(players ?? []), ...matchPlayersList];
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
      ...(players ?? []).filter((p) => availablePlayerIds.has(p.id) && p.role !== "staff"),
      ...matchPlayersList,
    ];

    const config = TEAM_TYPE_CONFIG[teamType];

    const result = generateSubstitutionPlan(
      formation,
      availablePlayers,
      (availability ?? []) as AvailabilityWithPlayer[],
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
  }

  if (playersLoading || lineupLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

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
            disabled={!players?.length}
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
          <div className="grid grid-cols-2 gap-2">
            {benchPlayers.map((player) => (
              <BenchPlayer
                key={player.id}
                id={player.id}
                name={player.name}
                jerseyNumber={player.jersey_number}
                photoUrl={player.photo_url}
                draggable
              />
            ))}
          </div>
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

        {/* Substitution Plan */}
        {substitutionPlan && (
          <SubstitutionPlanView plan={substitutionPlan} />
        )}

        {hasChanges && (
          <Button
            className="w-full"
            onClick={handleSave}
            disabled={saveLineup.isPending}
          >
            {saveLineup.isPending ? "Opslaan..." : "Opstelling opslaan"}
          </Button>
        )}
      </div>
    </DndContext>
  );
}

// Simple droppable zone component
import { useDroppable } from "@dnd-kit/core";

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

import { cn } from "@/lib/utils";
