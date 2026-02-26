"use client";

import type { LucideIcon } from "lucide-react";

interface TopPlayerCardProps {
  title: string;
  playerName: string;
  value: string;
  icon: LucideIcon;
}

export function TopPlayerCard({
  title,
  playerName,
  value,
  icon: Icon,
}: TopPlayerCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-md">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-100">
        <Icon className="size-5 text-primary-700" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="truncate text-sm font-semibold">{playerName}</p>
      </div>
      <span className="shrink-0 text-sm font-bold text-primary-700">
        {value}
      </span>
    </div>
  );
}
