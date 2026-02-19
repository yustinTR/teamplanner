"use client";

import { useDraggable } from "@dnd-kit/core";
import { Avatar } from "@/components/atoms/Avatar";
import { cn } from "@/lib/utils";

interface BenchPlayerProps {
  id: string;
  name: string;
  jerseyNumber?: number | null;
  photoUrl?: string | null;
  draggable?: boolean;
}

export function BenchPlayer({
  id,
  name,
  jerseyNumber,
  photoUrl,
  draggable = false,
}: BenchPlayerProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bench-${id}`,
    data: { playerId: id, fromBench: true },
    disabled: !draggable,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[44px] items-center gap-2 rounded-lg border px-3 py-2",
        draggable && "cursor-grab touch-none",
        isDragging && "opacity-50"
      )}
      {...(draggable ? { ...listeners, ...attributes } : {})}
    >
      <Avatar src={photoUrl} fallback={name} size="sm" />
      <div className="min-w-0 flex-1">
        <span className="truncate text-sm font-medium">{name}</span>
      </div>
      {jerseyNumber != null && (
        <span className="text-xs text-muted-foreground">#{jerseyNumber}</span>
      )}
    </div>
  );
}
