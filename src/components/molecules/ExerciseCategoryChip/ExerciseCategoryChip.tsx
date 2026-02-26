"use client";

import { cn } from "@/lib/utils";

interface ExerciseCategoryChipProps {
  category: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function ExerciseCategoryChip({ label, selected, onClick }: ExerciseCategoryChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-[36px] shrink-0 items-center rounded-full px-3.5 text-sm font-medium transition-colors",
        selected
          ? "bg-primary-700 text-white"
          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
      )}
    >
      {label}
    </button>
  );
}
