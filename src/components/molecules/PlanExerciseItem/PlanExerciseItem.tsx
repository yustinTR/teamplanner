"use client";

import { GripVertical, Trash2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EXERCISE_CATEGORY_LABELS } from "@/lib/constants";

interface PlanExerciseItemProps {
  id: string;
  title: string;
  category: string;
  duration: number;
  onRemove?: () => void;
  dragHandleProps?: Record<string, unknown>;
  isCoach?: boolean;
}

export function PlanExerciseItem({
  title,
  category,
  duration,
  onRemove,
  dragHandleProps,
  isCoach = false,
}: PlanExerciseItemProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-3">
      {isCoach && (
        <button
          type="button"
          className="flex size-11 shrink-0 touch-none items-center justify-center text-neutral-400 hover:text-neutral-600"
          {...dragHandleProps}
        >
          <GripVertical className="size-5" />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-neutral-900">{title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-xs">
            {EXERCISE_CATEGORY_LABELS[category] ?? category}
          </Badge>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {duration} min
          </span>
        </div>
      </div>
      {isCoach && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="flex size-11 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  );
}
