"use client";

import { Check, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";

interface EventTaskItemProps {
  title: string;
  description?: string | null;
  assignedTo?: string | null;
  deadline?: string | null;
  isDone: boolean;
  onToggleDone?: () => void;
  onClaim?: () => void;
  canClaim?: boolean;
}

export function EventTaskItem({
  title,
  description,
  assignedTo,
  deadline,
  isDone,
  onToggleDone,
  onClaim,
  canClaim,
}: EventTaskItemProps) {
  return (
    <div className={cn(
      "flex min-h-[44px] items-start gap-3 rounded-lg border p-3",
      isDone && "bg-muted/50 opacity-60"
    )}>
      {onToggleDone && (
        <button
          type="button"
          onClick={onToggleDone}
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border",
            isDone
              ? "border-success bg-success text-success-foreground"
              : "border-border hover:border-primary"
          )}
        >
          {isDone && <Check className="size-3" />}
        </button>
      )}
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-medium", isDone && "line-through")}>{title}</p>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {assignedTo && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="size-3" />
              {assignedTo}
            </span>
          )}
          {deadline && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              {new Date(deadline).toLocaleDateString("nl-NL")}
            </span>
          )}
        </div>
      </div>
      {canClaim && !assignedTo && !isDone && onClaim && (
        <Button variant="outline" size="sm" onClick={onClaim}>
          Claim
        </Button>
      )}
    </div>
  );
}
