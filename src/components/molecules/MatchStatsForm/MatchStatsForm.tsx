"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";

export interface PlayerStatRow {
  playerId: string;
  playerName: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

interface MatchStatsFormProps {
  players: { id: string; name: string }[];
  initialStats?: PlayerStatRow[];
  onSubmit: (stats: PlayerStatRow[]) => Promise<void>;
}

export function MatchStatsForm({
  players,
  initialStats,
  onSubmit,
}: MatchStatsFormProps) {
  const [rows, setRows] = useState<PlayerStatRow[]>(() =>
    players.map((p) => {
      const existing = initialStats?.find((s) => s.playerId === p.id);
      return {
        playerId: p.id,
        playerName: p.name,
        goals: existing?.goals ?? 0,
        assists: existing?.assists ?? 0,
        yellowCards: existing?.yellowCards ?? 0,
        redCards: existing?.redCards ?? 0,
      };
    })
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateRow(
    playerId: string,
    field: keyof Pick<PlayerStatRow, "goals" | "assists" | "yellowCards" | "redCards">,
    value: number
  ) {
    setRows((prev) =>
      prev.map((r) =>
        r.playerId === playerId ? { ...r, [field]: Math.max(0, value) } : r
      )
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(rows);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Header */}
      <div className="grid grid-cols-[1fr_3rem_3rem_3rem_3rem] items-center gap-1 text-xs font-medium text-muted-foreground">
        <span>Speler</span>
        <span className="text-center">G</span>
        <span className="text-center">A</span>
        <span className="text-center">GK</span>
        <span className="text-center">RK</span>
      </div>

      {/* Rows */}
      {rows.map((row) => (
        <div
          key={row.playerId}
          className="grid grid-cols-[1fr_3rem_3rem_3rem_3rem] items-center gap-1"
        >
          <span className="truncate text-sm font-medium">
            {row.playerName}
          </span>
          <Input
            type="number"
            min={0}
            value={row.goals}
            onChange={(e) =>
              updateRow(row.playerId, "goals", parseInt(e.target.value) || 0)
            }
            className="min-h-[36px] px-1 text-center text-sm"
          />
          <Input
            type="number"
            min={0}
            value={row.assists}
            onChange={(e) =>
              updateRow(row.playerId, "assists", parseInt(e.target.value) || 0)
            }
            className="min-h-[36px] px-1 text-center text-sm"
          />
          <Input
            type="number"
            min={0}
            value={row.yellowCards}
            onChange={(e) =>
              updateRow(
                row.playerId,
                "yellowCards",
                parseInt(e.target.value) || 0
              )
            }
            className="min-h-[36px] px-1 text-center text-sm"
          />
          <Input
            type="number"
            min={0}
            value={row.redCards}
            onChange={(e) =>
              updateRow(
                row.playerId,
                "redCards",
                parseInt(e.target.value) || 0
              )
            }
            className="min-h-[36px] px-1 text-center text-sm"
          />
        </div>
      ))}

      {players.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Geen spelers in de opstelling.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
        Opslaan
      </Button>
    </form>
  );
}
