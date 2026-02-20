"use client";

import { Button } from "@/components/atoms/Button";
import { getFormationsForTeamType } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface FormationSelectorProps {
  value: string;
  onChange: (formation: string) => void;
  teamType?: string;
}

export function FormationSelector({ value, onChange, teamType = "senioren" }: FormationSelectorProps) {
  const formations = getFormationsForTeamType(teamType);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {Object.keys(formations).map((formation) => (
        <Button
          key={formation}
          variant={value === formation ? "default" : "outline"}
          size="sm"
          className={cn("shrink-0")}
          onClick={() => onChange(formation)}
        >
          {formation}
        </Button>
      ))}
    </div>
  );
}
