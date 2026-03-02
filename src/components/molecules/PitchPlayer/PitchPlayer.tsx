"use client";

import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PlayerCard } from "@/components/atoms/PlayerCard";
import { spring } from "@/lib/animations";
import type { CardTier } from "@/lib/player-rating";

interface PitchPlayerProps {
  id: string;
  name: string;
  jerseyNumber?: number | null;
  positionLabel: string;
  x: number;
  y: number;
  draggable?: boolean;
  overall?: number | null;
  cardTier?: CardTier | null;
  photoUrl?: string | null;
}

export function PitchPlayer({
  id,
  name,
  jerseyNumber,
  positionLabel,
  x,
  y,
  draggable = false,
  overall,
  cardTier,
  photoUrl,
}: PitchPlayerProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled: !draggable,
  });

  const style = {
    left: `${x}%`,
    top: `${y}%`,
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  const showCard = overall != null && cardTier != null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center",
        draggable && "cursor-grab touch-none",
        isDragging && "z-50 cursor-grabbing"
      )}
      {...(draggable ? { ...listeners, ...attributes } : {})}
    >
      <motion.div
        animate={{
          scale: isDragging ? 1.15 : 1,
          filter: isDragging
            ? "drop-shadow(0 8px 16px rgba(0,0,0,0.2))"
            : "drop-shadow(0 0 0 rgba(0,0,0,0))",
        }}
        transition={spring.snappy}
        className="flex flex-col items-center"
      >
      {showCard ? (
        <PlayerCard
          name={name}
          position={positionLabel}
          overall={overall}
          tier={cardTier}
          photoUrl={photoUrl}
          size="sm"
          className={cn(isDragging && "ring-2 ring-primary ring-offset-1")}
        />
      ) : (
        <>
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-bold text-primary-foreground shadow-md",
              isDragging && "ring-2 ring-primary ring-offset-2"
            )}
          >
            {jerseyNumber ?? positionLabel}
          </div>
          <span className="mt-0.5 max-w-[80px] truncate text-center text-[10px] font-medium text-white drop-shadow-md">
            {name}
          </span>
        </>
      )}
      </motion.div>
    </div>
  );
}
