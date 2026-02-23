"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { DETAILED_POSITION_LABELS } from "@/lib/constants";

interface MatchPlayerChipProps {
  name: string;
  position?: string | null;
  onDelete?: () => void;
}

export function MatchPlayerChip({ name, position, onDelete }: MatchPlayerChipProps) {
  return (
    <div className="flex min-h-[44px] items-center gap-2 rounded-lg border px-3 py-2">
      <span className="min-w-0 flex-1 truncate text-sm font-medium">{name}</span>
      <Badge variant="default" label="Leen" />
      {position && (
        <span className="text-xs text-muted-foreground">
          {DETAILED_POSITION_LABELS[position] ?? position}
        </span>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
