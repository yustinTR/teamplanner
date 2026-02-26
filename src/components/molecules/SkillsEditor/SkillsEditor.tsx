"use client";

import { useState } from "react";
import { PLAYER_SKILLS, type PlayerSkills } from "@/lib/constants";
import { Button } from "@/components/atoms/Button";
import { Slider } from "@/components/ui/slider";

interface SkillsEditorProps {
  skills: PlayerSkills;
  onSave: (skills: PlayerSkills) => void | Promise<void>;
  isSaving?: boolean;
}

export function SkillsEditor({ skills, onSave, isSaving }: SkillsEditorProps) {
  const [values, setValues] = useState<PlayerSkills>(() => {
    const initial: PlayerSkills = {};
    for (const skill of PLAYER_SKILLS) {
      initial[skill.key] = skills[skill.key] ?? 5;
    }
    return initial;
  });

  function handleChange(key: string, value: number[]) {
    setValues((prev) => ({ ...prev, [key]: value[0] }));
  }

  async function handleSave() {
    await onSave(values);
  }

  return (
    <div className="space-y-5">
      {PLAYER_SKILLS.map((skill) => (
        <div key={skill.key}>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-900">
              {skill.label}
            </label>
            <span className="min-w-[2ch] text-right text-sm font-semibold text-primary-700">
              {values[skill.key]}
            </span>
          </div>
          <Slider
            value={[values[skill.key]]}
            onValueChange={(value) => handleChange(skill.key, value)}
            min={1}
            max={10}
            step={1}
          />
        </div>
      ))}

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
