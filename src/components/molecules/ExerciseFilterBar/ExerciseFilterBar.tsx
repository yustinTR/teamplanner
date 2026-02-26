"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { ExerciseCategoryChip } from "@/components/molecules/ExerciseCategoryChip";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EXERCISE_CATEGORY_LABELS,
  EXERCISE_DIFFICULTY_LABELS,
  EXERCISE_DURATION_OPTIONS,
  EXERCISE_PLAYER_COUNT_OPTIONS,
} from "@/lib/constants";
import type { ExerciseCategory, ExerciseDifficulty, ExerciseFilters } from "@/types";

interface ExerciseFilterBarProps {
  filters: ExerciseFilters;
  onFiltersChange: (filters: ExerciseFilters) => void;
}

export function ExerciseFilterBar({ filters, onFiltersChange }: ExerciseFilterBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const categories = Object.entries(EXERCISE_CATEGORY_LABELS) as [string, string][];

  const hasAdvancedFilters = !!(filters.difficulty || filters.maxDuration || filters.minPlayers);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(([value, label]) => (
          <ExerciseCategoryChip
            key={value}
            category={value}
            label={label}
            selected={filters.category === value}
            onClick={() =>
              onFiltersChange({
                ...filters,
                category: filters.category === value ? undefined : (value as ExerciseCategory),
              })
            }
          />
        ))}
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <SlidersHorizontal className="size-4" />
            Filters
            {hasAdvancedFilters && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary-700 text-xs text-white">
                !
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-auto max-h-[70vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 px-4 pb-4">
            <div className="space-y-2">
              <Label>Moeilijkheid</Label>
              <Select
                value={filters.difficulty ?? "all"}
                onValueChange={(v) =>
                  onFiltersChange({
                    ...filters,
                    difficulty: v === "all" ? undefined : (v as ExerciseDifficulty),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Alle niveaus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle niveaus</SelectItem>
                  {Object.entries(EXERCISE_DIFFICULTY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Maximale duur</Label>
              <Select
                value={filters.maxDuration?.toString() ?? "all"}
                onValueChange={(v) =>
                  onFiltersChange({
                    ...filters,
                    maxDuration: v === "all" ? undefined : Number(v),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Geen limiet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Geen limiet</SelectItem>
                  {EXERCISE_DURATION_OPTIONS.map((d) => (
                    <SelectItem key={d} value={d.toString()}>
                      Max {d} min
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Aantal spelers</Label>
              <Select
                value={
                  filters.minPlayers
                    ? `${filters.minPlayers}-${filters.maxPlayers}`
                    : "all"
                }
                onValueChange={(v) => {
                  if (v === "all") {
                    onFiltersChange({ ...filters, minPlayers: undefined, maxPlayers: undefined });
                  } else {
                    const opt = EXERCISE_PLAYER_COUNT_OPTIONS.find(
                      (o) => `${o.min}-${o.max}` === v
                    );
                    if (opt) {
                      onFiltersChange({ ...filters, minPlayers: opt.min, maxPlayers: opt.max });
                    }
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Alle groepen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle groepen</SelectItem>
                  {EXERCISE_PLAYER_COUNT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.label} value={`${opt.min}-${opt.max}`}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onFiltersChange({ category: filters.category, teamType: filters.teamType });
                  setSheetOpen(false);
                }}
              >
                Reset
              </Button>
              <Button className="flex-1" onClick={() => setSheetOpen(false)}>
                Toepassen
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
