"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { Badge } from "@/components/atoms/Badge";
import { POSITION_LABELS } from "@/lib/constants";
import type { ParsedMatch, ParsedPlayer } from "@/lib/voetbal-nl-parser";

interface ImportPreviewProps {
  teamName: string | null;
  matches: ParsedMatch[];
  players: ParsedPlayer[];
  onConfirm: (selected: {
    matches: ParsedMatch[];
    players: ParsedPlayer[];
  }) => void;
  onCancel: () => void;
  isConfirming?: boolean;
}

export function ImportPreview({
  teamName,
  matches,
  players,
  onConfirm,
  onCancel,
  isConfirming = false,
}: ImportPreviewProps) {
  const [selectedMatches, setSelectedMatches] = useState<Set<number>>(
    () => new Set(matches.map((_, i) => i))
  );
  const [selectedPlayers, setSelectedPlayers] = useState<Set<number>>(
    () => new Set(players.map((_, i) => i))
  );

  function toggleMatch(index: number) {
    setSelectedMatches((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  function togglePlayer(index: number) {
    setSelectedPlayers((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  function handleConfirm() {
    onConfirm({
      matches: matches.filter((_, i) => selectedMatches.has(i)),
      players: players.filter((_, i) => selectedPlayers.has(i)),
    });
  }

  const totalSelected = selectedMatches.size + selectedPlayers.size;

  return (
    <div className="space-y-6">
      {teamName && (
        <p className="text-sm text-muted-foreground">
          Gevonden team: <span className="font-medium text-foreground">{teamName}</span>
        </p>
      )}

      {/* Matches */}
      {matches.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium">
            Wedstrijden ({selectedMatches.size}/{matches.length})
          </h3>
          <div className="space-y-2">
            {matches.map((match, i) => (
              <Card key={i} className="p-3">
                <label className="flex min-h-[44px] cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedMatches.has(i)}
                    onChange={() => toggleMatch(i)}
                    className="size-4 shrink-0 rounded border-input accent-primary"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {match.opponent}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {match.date}
                      {match.homeAway === "home" ? " (thuis)" : " (uit)"}
                      {match.location ? ` · ${match.location}` : ""}
                    </span>
                  </div>
                </label>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Players */}
      {players.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium">
            Spelers ({selectedPlayers.size}/{players.length})
          </h3>
          <div className="space-y-2">
            {players.map((player, i) => (
              <Card key={i} className="p-3">
                <label className="flex min-h-[44px] cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedPlayers.has(i)}
                    onChange={() => togglePlayer(i)}
                    className="size-4 shrink-0 rounded border-input accent-primary"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {player.name}
                  </span>
                  {player.position && (
                    <Badge
                      variant="default"
                      label={
                        POSITION_LABELS[player.position] ?? player.position
                      }
                    />
                  )}
                </label>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {matches.length === 0 && players.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Geen wedstrijden of spelers gevonden op deze pagina.
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={isConfirming}
        >
          Annuleren
        </Button>
        <Button
          className="flex-1"
          onClick={handleConfirm}
          disabled={totalSelected === 0 || isConfirming}
        >
          {isConfirming
            ? "Importeren..."
            : [
                selectedMatches.size > 0 &&
                  `${selectedMatches.size} wedstrijden`,
                selectedPlayers.size > 0 &&
                  `${selectedPlayers.size} spelers`,
              ]
                .filter(Boolean)
                .join(" en ") + " importeren"}
        </Button>
      </div>
    </div>
  );
}
