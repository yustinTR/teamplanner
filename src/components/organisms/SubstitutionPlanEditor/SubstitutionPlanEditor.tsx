"use client";

import { useState } from "react";
import { Plus, Printer } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { SubstitutionMomentCard } from "@/components/molecules/SubstitutionMomentCard";
import { SubstitutionMomentForm } from "@/components/molecules/SubstitutionMomentForm";
import { PlayerMinutesBar } from "@/components/molecules/PlayerMinutesBar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TEAM_TYPE_CONFIG } from "@/lib/constants";
import { recalculatePlayerMinutes } from "@/lib/lineup-generator";
import type { LineupPosition, Player, SubstitutionPlan, SubstitutionMoment } from "@/types";

interface SubstitutionPlanEditorProps {
  substitutionPlan: SubstitutionPlan | null;
  positions: LineupPosition[];
  benchPlayers: Player[];
  playerMap: Map<string, Player>;
  teamType: string;
  onChange: (plan: SubstitutionPlan | null) => void;
}

export function SubstitutionPlanEditor({
  substitutionPlan,
  positions,
  benchPlayers,
  playerMap,
  teamType,
  onChange,
}: SubstitutionPlanEditorProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const config = TEAM_TYPE_CONFIG[teamType] ?? TEAM_TYPE_CONFIG.senioren;
  const totalMinutes = config.halfMinutes * config.halves;
  const moments = substitutionPlan?.substitutionMoments ?? [];

  // Build name map from all sources
  const allPlayerNames = new Map<string, string>();
  // Names from playerMap (all players including field players)
  for (const [id, player] of playerMap) {
    allPlayerNames.set(id, player.name);
  }
  // Names from existing plan (covers players who may have been swapped around)
  if (substitutionPlan) {
    for (const pm of substitutionPlan.playerMinutes) {
      if (!allPlayerNames.has(pm.player_id)) {
        allPlayerNames.set(pm.player_id, pm.name);
      }
    }
    for (const m of substitutionPlan.substitutionMoments) {
      for (const p of [...m.out, ...m.in]) {
        if (!allPlayerNames.has(p.player_id)) {
          allPlayerNames.set(p.player_id, p.name);
        }
      }
    }
  }

  // Simulate field/bench state at a given minute to determine who can be swapped
  function getFieldAndBenchAtMinute(atMinute: number, excludeIndex?: number) {
    const fieldMap = new Map<string, { id: string; name: string; position_label: string }>();
    for (const pos of positions) {
      if (pos.player_id) {
        fieldMap.set(pos.player_id, {
          id: pos.player_id,
          name: allPlayerNames.get(pos.player_id) ?? "?",
          position_label: pos.position_label,
        });
      }
    }

    const benchSet = new Map<string, { id: string; name: string }>();
    for (const bp of benchPlayers) {
      benchSet.set(bp.id, { id: bp.id, name: bp.name });
    }

    // Apply all moments before atMinute
    const sorted = [...moments]
      .map((m, i) => ({ ...m, _idx: i }))
      .sort((a, b) => a.minute - b.minute);

    for (const moment of sorted) {
      if (moment._idx === excludeIndex) continue;
      if (moment.minute >= atMinute) break;

      for (let i = 0; i < moment.out.length; i++) {
        const outP = moment.out[i];
        const inP = moment.in[i];
        if (!inP) continue;

        const pos = fieldMap.get(outP.player_id)?.position_label ?? outP.position_label;
        fieldMap.delete(outP.player_id);
        benchSet.delete(inP.player_id);

        fieldMap.set(inP.player_id, {
          id: inP.player_id,
          name: inP.name,
          position_label: pos,
        });
        benchSet.set(outP.player_id, {
          id: outP.player_id,
          name: outP.name,
        });
      }
    }

    return {
      field: [...fieldMap.values()],
      bench: [...benchSet.values()],
    };
  }

  function buildPlan(newMoments: SubstitutionMoment[]): SubstitutionPlan {
    const startingFieldIds = positions.filter((p) => p.player_id).map((p) => p.player_id);

    // Collect all names from moments too
    const names = new Map(allPlayerNames);
    for (const m of newMoments) {
      for (const p of [...m.out, ...m.in]) {
        names.set(p.player_id, p.name);
      }
    }

    const playerMinutes = recalculatePlayerMinutes(
      newMoments,
      startingFieldIds,
      names,
      totalMinutes
    );

    return {
      teamType: config.label,
      totalMinutes,
      substitutionMoments: newMoments.sort((a, b) => a.minute - b.minute),
      playerMinutes,
    };
  }

  function handleAdd() {
    setEditingIndex(null);
    setSheetOpen(true);
  }

  function handleEdit(index: number) {
    setEditingIndex(index);
    setSheetOpen(true);
  }

  function handleDelete(index: number) {
    const newMoments = moments.filter((_, i) => i !== index);
    if (newMoments.length === 0) {
      onChange(null);
    } else {
      onChange(buildPlan(newMoments));
    }
  }

  function handleFormSubmit(moment: SubstitutionMoment) {
    let newMoments: SubstitutionMoment[];
    if (editingIndex !== null) {
      newMoments = moments.map((m, i) => (i === editingIndex ? moment : m));
    } else {
      newMoments = [...moments, moment];
    }
    onChange(buildPlan(newMoments));
    setSheetOpen(false);
    setEditingIndex(null);
  }

  function handlePrint() {
    window.print();
  }

  // Get field/bench for the form context (initial values)
  const formMinute = editingIndex !== null ? moments[editingIndex]?.minute ?? 1 : 1;
  const { field: formField, bench: formBench } = getFieldAndBenchAtMinute(
    formMinute,
    editingIndex ?? undefined
  );

  // Callback for dynamic field/bench when minute changes in the form
  function getPlayersAtMinute(atMinute: number) {
    return getFieldAndBenchAtMinute(atMinute, editingIndex ?? undefined);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          Wisselschema ({config.label} &middot; {totalMinutes} min)
        </h3>
        <div className="flex gap-1">
          {substitutionPlan && (
            <Button variant="ghost" size="sm" onClick={handlePrint}>
              <Printer className="mr-1 size-4" />
              Print
            </Button>
          )}
        </div>
      </div>

      <Button variant="outline" size="sm" className="gap-1.5" onClick={handleAdd}>
        <Plus className="size-4" />
        Wisselmoment toevoegen
      </Button>

      {moments.length > 0 && (
        <div className="space-y-2">
          {[...moments]
            .sort((a, b) => a.minute - b.minute)
            .map((moment, sortedIdx) => {
              // Find original index for edit/delete
              const originalIdx = moments.indexOf(moment);
              return (
                <SubstitutionMomentCard
                  key={`${moment.minute}-${sortedIdx}`}
                  moment={moment}
                  onEdit={() => handleEdit(originalIdx)}
                  onDelete={() => handleDelete(originalIdx)}
                />
              );
            })}
        </div>
      )}

      {substitutionPlan && substitutionPlan.playerMinutes.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">
            Speelminuten
          </h4>
          <div className="space-y-3">
            {substitutionPlan.playerMinutes.map((pm) => (
              <PlayerMinutesBar
                key={pm.player_id}
                name={pm.name}
                totalMinutes={pm.totalMinutes}
                percentage={pm.percentage}
                totalMatchMinutes={totalMinutes}
                periods={pm.periods}
              />
            ))}
          </div>
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingIndex !== null ? "Wisselmoment bewerken" : "Wisselmoment toevoegen"}
            </SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4">
            <SubstitutionMomentForm
              key={editingIndex ?? "new"}
              fieldPlayers={formField}
              benchPlayers={formBench}
              totalMinutes={totalMinutes}
              defaultValues={editingIndex !== null ? moments[editingIndex] : undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setSheetOpen(false);
                setEditingIndex(null);
              }}
              getPlayersAtMinute={getPlayersAtMinute}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
