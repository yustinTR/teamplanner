"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { seasonLabel } from "@/lib/season";

interface SeasonSelectProps {
  /** Start years, newest first. */
  seasons: number[];
  value: number;
  onChange: (season: number) => void;
  className?: string;
}

export function SeasonSelect({ seasons, value, onChange, className }: SeasonSelectProps) {
  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger className={className} aria-label="Seizoen">
        <SelectValue placeholder="Seizoen" />
      </SelectTrigger>
      <SelectContent>
        {seasons.map((season) => (
          <SelectItem key={season} value={String(season)}>
            Seizoen {seasonLabel(season)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
