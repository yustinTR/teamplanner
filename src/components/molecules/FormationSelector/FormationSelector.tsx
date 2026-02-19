"use client";

import { Button } from "@/components/atoms/Button";
import { FORMATIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface FormationSelectorProps {
  value: string;
  onChange: (formation: string) => void;
}

export function FormationSelector({ value, onChange }: FormationSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {Object.keys(FORMATIONS).map((formation) => (
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
