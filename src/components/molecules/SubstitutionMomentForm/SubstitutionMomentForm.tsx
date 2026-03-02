"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SubstitutionMoment } from "@/types";

interface PlayerOption {
  id: string;
  name: string;
  position_label?: string;
}

interface SubstitutionMomentFormProps {
  fieldPlayers: PlayerOption[];
  benchPlayers: PlayerOption[];
  totalMinutes: number;
  defaultValues?: SubstitutionMoment;
  onSubmit: (moment: SubstitutionMoment) => void;
  onCancel: () => void;
  getPlayersAtMinute?: (minute: number) => { field: PlayerOption[]; bench: PlayerOption[] };
}

interface SwapPair {
  outId: string;
  inId: string;
}

export function SubstitutionMomentForm({
  fieldPlayers,
  benchPlayers,
  totalMinutes,
  defaultValues,
  onSubmit,
  onCancel,
  getPlayersAtMinute,
}: SubstitutionMomentFormProps) {
  const [minute, setMinute] = useState(defaultValues?.minute ?? 0);
  const [swaps, setSwaps] = useState<SwapPair[]>(() => {
    if (defaultValues) {
      return defaultValues.out.map((out, i) => ({
        outId: out.player_id,
        inId: defaultValues.in[i]?.player_id ?? "",
      }));
    }
    return [{ outId: "", inId: "" }];
  });

  // Dynamically compute field/bench based on minute (accounts for prior substitutions)
  const { field: dynamicField, bench: dynamicBench } = useMemo(() => {
    if (getPlayersAtMinute && minute > 0) {
      return getPlayersAtMinute(minute);
    }
    return { field: fieldPlayers, bench: benchPlayers };
  }, [getPlayersAtMinute, minute, fieldPlayers, benchPlayers]);

  // Collect already-selected IDs so each player can only be picked once
  const selectedOutIds = new Set(swaps.map((s) => s.outId).filter(Boolean));
  const selectedInIds = new Set(swaps.map((s) => s.inId).filter(Boolean));

  function handleMinuteChange(newMinute: number) {
    setMinute(newMinute);
    // Reset swap selections when minute changes, since available players change
    if (getPlayersAtMinute) {
      setSwaps((prev) =>
        prev.map((s) => {
          const { field, bench } = getPlayersAtMinute(newMinute > 0 ? newMinute : 1);
          const fieldIds = new Set(field.map((p) => p.id));
          const benchIds = new Set(bench.map((p) => p.id));
          return {
            outId: fieldIds.has(s.outId) ? s.outId : "",
            inId: benchIds.has(s.inId) ? s.inId : "",
          };
        })
      );
    }
  }

  function handleSwapChange(index: number, field: "outId" | "inId", value: string) {
    setSwaps((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  function addSwapPair() {
    setSwaps((prev) => [...prev, { outId: "", inId: "" }]);
  }

  function removeSwapPair(index: number) {
    setSwaps((prev) => prev.filter((_, i) => i !== index));
  }

  const allFieldPlayers = [...dynamicField];
  const allBenchPlayers = [...dynamicBench];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validSwaps = swaps.filter((s) => s.outId && s.inId);
    if (validSwaps.length === 0 || minute <= 0) return;

    const fieldMap = new Map(allFieldPlayers.map((p) => [p.id, p]));
    const benchMap = new Map(allBenchPlayers.map((p) => [p.id, p]));

    const moment: SubstitutionMoment = {
      minute,
      out: validSwaps.map((s) => {
        const player = fieldMap.get(s.outId);
        return {
          player_id: s.outId,
          name: player?.name ?? "?",
          position_label: player?.position_label ?? "?",
        };
      }),
      in: validSwaps.map((s) => {
        const player = benchMap.get(s.inId) ?? fieldMap.get(s.inId);
        return {
          player_id: s.inId,
          name: player?.name ?? "?",
          position_label:
            // Inherit position from the outgoing player
            fieldMap.get(s.outId)?.position_label ?? "?",
        };
      }),
    };

    onSubmit(moment);
  }

  const isValid = minute > 0 && minute < totalMinutes && swaps.some((s) => s.outId && s.inId);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="sub-minute">Minuut</Label>
        <Input
          id="sub-minute"
          type="number"
          min={1}
          max={totalMinutes - 1}
          value={minute || ""}
          onChange={(e) => handleMinuteChange(Number(e.target.value))}
          required
        />
      </div>

      {swaps.map((swap, index) => (
        <div key={index} className="space-y-2 rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Wissel {index + 1}</span>
            {swaps.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSwapPair(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label>Eruit</Label>
            <Select
              value={swap.outId}
              onValueChange={(v) => handleSwapChange(index, "outId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kies speler" />
              </SelectTrigger>
              <SelectContent>
                {allFieldPlayers
                  .filter((p) => p.id === swap.outId || !selectedOutIds.has(p.id))
                  .map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} {p.position_label ? `(${p.position_label})` : ""}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Erin</Label>
            <Select
              value={swap.inId}
              onValueChange={(v) => handleSwapChange(index, "inId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kies speler" />
              </SelectTrigger>
              <SelectContent>
                {allBenchPlayers
                  .filter((p) => p.id === swap.inId || !selectedInIds.has(p.id))
                  .map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}

      {allFieldPlayers.length > swaps.length && allBenchPlayers.length > swaps.length && (
        <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={addSwapPair}>
          <Plus className="size-4" />
          Wissel toevoegen
        </Button>
      )}

      <div className="flex gap-2">
        <Button type="submit" className="flex-1" disabled={!isValid}>
          Opslaan
        </Button>
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Annuleren
        </Button>
      </div>
    </form>
  );
}
