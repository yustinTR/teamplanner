"use client";

import { CalendarPlus, Clock, Goal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import type { SyncLogEntry } from "@/hooks/use-sync-log";
import type { MatchChange } from "@/lib/match-sync";

interface SyncLogListProps {
  entries: SyncLogEntry[];
}

const CHANGE_META: Record<
  MatchChange["type"],
  { icon: LucideIcon; label: string }
> = {
  created: { icon: CalendarPlus, label: "Nieuw" },
  updated: { icon: Clock, label: "Gewijzigd" },
  result: { icon: Goal, label: "Uitslag" },
};

function summarize(entry: SyncLogEntry): string {
  const parts: string[] = [];
  if (entry.matches_created > 0)
    parts.push(
      entry.matches_created === 1
        ? "1 nieuwe wedstrijd"
        : `${entry.matches_created} nieuwe wedstrijden`
    );
  if (entry.matches_updated > 0)
    parts.push(
      entry.matches_updated === 1
        ? "1 wijziging"
        : `${entry.matches_updated} wijzigingen`
    );
  if (entry.results_updated > 0)
    parts.push(
      entry.results_updated === 1
        ? "1 uitslag"
        : `${entry.results_updated} uitslagen`
    );
  return parts.join(", ");
}

export function SyncLogList({ entries }: SyncLogListProps) {
  if (entries.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Nog geen wijzigingen binnengekomen via de automatische synchronisatie.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {entries.map((entry) => (
        <li key={entry.id} className="text-xs">
          <p className="font-medium text-neutral-700">
            {formatDateShort(entry.run_at)} — {summarize(entry)}
          </p>
          {entry.changes.length > 0 && (
            <ul className="mt-1 space-y-0.5 text-muted-foreground">
              {entry.changes.slice(0, 5).map((change, index) => {
                const { icon: Icon, label } = CHANGE_META[change.type];
                return (
                  <li key={index} className="flex items-center gap-1.5">
                    <Icon className="size-3 shrink-0" aria-hidden="true" />
                    <span className="truncate">
                      {label}: {change.opponent} (
                      {formatDateShort(change.matchDate)})
                    </span>
                  </li>
                );
              })}
              {entry.changes.length > 5 && (
                <li className="text-muted-foreground">
                  … en {entry.changes.length - 5} meer
                </li>
              )}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
