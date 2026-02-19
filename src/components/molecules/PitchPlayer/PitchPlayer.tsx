"use client";

import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface PitchPlayerProps {
  id: string;
  name: string;
  jerseyNumber?: number | null;
  positionLabel: string;
  x: number;
  y: number;
  draggable?: boolean;
}

export function PitchPlayer({
  id,
  name,
  jerseyNumber,
  positionLabel,
  x,
  y,
  draggable = false,
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center",
        draggable && "cursor-grab touch-none",
        isDragging && "z-50 cursor-grabbing opacity-80"
      )}
      {...(draggable ? { ...listeners, ...attributes } : {})}
    >
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-bold text-primary-foreground shadow-md",
          isDragging && "ring-2 ring-primary ring-offset-2"
        )}
      >
        {jerseyNumber ?? positionLabel}
      </div>
      <span className="mt-0.5 max-w-[60px] truncate text-center text-[10px] font-medium text-white drop-shadow-md">
        {name}
      </span>
    </div>
  );
}
