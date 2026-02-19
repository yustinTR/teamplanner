"use client";

import { Check, X, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AvailabilityStatus } from "@/types";

interface AvailabilityToggleProps {
  value?: AvailabilityStatus | null;
  onChange: (status: AvailabilityStatus) => void;
  disabled?: boolean;
}

const options: { status: AvailabilityStatus; label: string; icon: typeof Check; activeClass: string }[] = [
  {
    status: "available",
    label: "Beschikbaar",
    icon: Check,
    activeClass: "bg-success/10 text-success border-success",
  },
  {
    status: "unavailable",
    label: "Afwezig",
    icon: X,
    activeClass: "bg-danger/10 text-danger border-danger",
  },
  {
    status: "maybe",
    label: "Misschien",
    icon: HelpCircle,
    activeClass: "bg-warning/10 text-warning border-warning",
  },
];

export function AvailabilityToggle({ value, onChange, disabled }: AvailabilityToggleProps) {
  return (
    <div className="flex gap-2">
      {options.map((option) => {
        const isActive = value === option.status;
        const Icon = option.icon;

        return (
          <button
            key={option.status}
            type="button"
            onClick={() => onChange(option.status)}
            disabled={disabled}
            className={cn(
              "flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? option.activeClass
                : "border-border text-muted-foreground hover:bg-accent/50",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <Icon className="size-4" />
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
