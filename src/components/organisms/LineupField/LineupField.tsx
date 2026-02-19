"use client";

import { useState, useCallback } from "react";
import { DndContext, type DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useAuthStore } from "@/stores/auth-store";
import { usePlayers } from "@/hooks/use-players";
import { useAvailability } from "@/hooks/use-availability";
import { useLineup, useSaveLineup } from "@/hooks/use-lineup";
import { PitchPlayer } from "@/components/molecules/PitchPlayer";
import { BenchPlayer } from "@/components/molecules/BenchPlayer";
import { FormationSelector } from "@/components/molecules/FormationSelector";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { FORMATIONS } from "@/lib/constants";
import type { LineupPosition } from "@/types";

interface LineupFieldProps {
  matchId: string;
}

export function LineupField({ matchId }: LineupFieldProps) {
  const { currentTeam } = useAuthStore();
  const { data: players, isLoading: playersLoading } = usePlayers(currentTeam?.id);
  const { data: availability } = useAvailability(matchId);
  const { data: existingLineup, isLoading: lineupLoading } = useLineup(matchId);
  const saveLineup = useSaveLineup();

  const [formation, setFormation] = useState(
    existingLineup?.formation ?? "4-3-3"
  );
  const [positions, setPositions] = useState<LineupPosition[]>(
    () => (existingLineup?.positions as unknown as LineupPosition[]) ?? []
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Update state when lineup loads
  useState(() => {
    if (existingLineup) {
      setFormation(existingLineup.formation ?? "4-3-3");
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

  const benchPlayers = (players ?? []).filter(
    (p) => availablePlayerIds.has(p.id) && !assignedPlayerIds.has(p.id)
  );

  const playerMap = new Map((players ?? []).map((p) => [p.id, p]));

  const formationSlots = FORMATIONS[formation] ?? FORMATIONS["4-3-3"];

  const handleFormationChange = useCallback(
    (newFormation: string) => {
      setFormation(newFormation);
      // Reset positions when changing formation
      const newSlots = FORMATIONS[newFormation] ?? [];
      const newPositions: LineupPosition[] = newSlots.map((slot, i) => {
        const existing = positions[i];
        return existing
          ? { ...existing, x: slot.x, y: slot.y, position_label: slot.position_label }
          : { player_id: "", x: slot.x, y: slot.y, position_label: slot.position_label };
      });
      setPositions(newPositions);
      setHasChanges(true);
    },
    [positions]
  );

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
        <FormationSelector value={formation} onChange={handleFormationChange} />

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
