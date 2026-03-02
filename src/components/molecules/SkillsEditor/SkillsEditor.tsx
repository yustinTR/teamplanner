"use client";

import { useState } from "react";
import { EAFC_ATTRIBUTE_CATEGORIES, type PlayerSkills } from "@/lib/constants";
import {
  ensureEafcFormat,
  calculateCategoryAverage,
  calculateOverallRating,
} from "@/lib/player-rating";
import { Button } from "@/components/atoms/Button";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SkillsEditorProps {
  skills: PlayerSkills;
  position?: string | null;
  onSave: (skills: PlayerSkills) => void | Promise<void>;
  isSaving?: boolean;
}

export function SkillsEditor({ skills, position, onSave, isSaving }: SkillsEditorProps) {
  const [values, setValues] = useState<PlayerSkills>(() => {
    const migrated = ensureEafcFormat(skills);
    const initial: PlayerSkills = {};
    for (const category of EAFC_ATTRIBUTE_CATEGORIES) {
      for (const attr of category.attributes) {
        initial[attr.key] = migrated[attr.key] ?? 50;
      }
    }
    return initial;
  });

  function handleChange(key: string, value: number[]) {
    setValues((prev) => ({ ...prev, [key]: value[0] }));
  }

  async function handleSave() {
    await onSave(values);
  }

  const overall = calculateOverallRating(values, position);

  return (
    <div className="space-y-3">
      {/* Overall rating header */}
      <div className="flex items-center justify-between rounded-lg bg-neutral-100 px-4 py-3">
        <span className="text-sm font-medium text-neutral-600">Overall</span>
        <span className="text-2xl font-bold text-neutral-900">{overall}</span>
      </div>

      <Accordion type="multiple" defaultValue={[EAFC_ATTRIBUTE_CATEGORIES[0].key]}>
        {EAFC_ATTRIBUTE_CATEGORIES.map((category) => {
          const catAvg = calculateCategoryAverage(values, category);

          return (
            <AccordionItem key={category.key} value={category.key}>
              <AccordionTrigger className="py-3">
                <div className="flex flex-1 items-center gap-2">
                  <span className="text-sm font-medium">{category.label}</span>
                  <span className="ml-auto mr-2 rounded bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-700">
                    {catAvg}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {category.attributes.map((attr) => (
                    <div key={attr.key}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <label className="text-sm text-neutral-700">
                          {attr.label}
                        </label>
                        <span className="min-w-[3ch] text-right text-sm font-semibold text-primary-700">
                          {values[attr.key]}
                        </span>
                      </div>
                      <Slider
                        value={[values[attr.key]]}
                        onValueChange={(v) => handleChange(attr.key, v)}
                        min={1}
                        max={99}
                        step={1}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <Button
        onClick={handleSave}
        className="w-full"
        disabled={isSaving}
      >
        {isSaving ? "Opslaan..." : "Opslaan"}
      </Button>
    </div>
  );
}
