"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { FormField } from "@/components/molecules/FormField";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { POSITION_GROUPS, DETAILED_POSITION_LABELS, ROLE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PlayerFormData {
  name: string;
  primary_position: string | null;
  secondary_positions: string[];
  role: string;
  jersey_number: number | null;
  notes: string | null;
}

interface PlayerFormProps {
  defaultValues?: Partial<PlayerFormData>;
  onSubmit: (data: PlayerFormData) => Promise<void>;
  submitLabel?: string;
}

export function PlayerForm({
  defaultValues,
  onSubmit,
  submitLabel = "Opslaan",
}: PlayerFormProps) {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string>(defaultValues?.role ?? "player");
  const [primaryPosition, setPrimaryPosition] = useState<string>(
    defaultValues?.primary_position ?? ""
  );
  const [secondaryPositions, setSecondaryPositions] = useState<string[]>(
    defaultValues?.secondary_positions ?? []
  );
  const [showSecondary, setShowSecondary] = useState(
    (defaultValues?.secondary_positions ?? []).length > 0
  );

  function toggleSecondary(pos: string) {
    setSecondaryPositions((prev) =>
      prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const jerseyNum = formData.get("jersey_number") as string;
      await onSubmit({
        name: formData.get("name") as string,
        primary_position: role === "staff" ? null : primaryPosition || null,
        secondary_positions: role === "staff" ? [] : secondaryPositions,
        role,
        jersey_number: jerseyNum ? parseInt(jerseyNum, 10) : null,
        notes: (formData.get("notes") as string) || null,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Naam" htmlFor="name">
        <Input
          id="name"
          name="name"
          placeholder="Volledige naam"
          defaultValue={defaultValues?.name}
          required
        />
      </FormField>

      <FormField label="Rol" htmlFor="role">
        <div className="flex gap-2">
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={cn(
                "flex-1 min-h-[44px] rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                role === value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background hover:bg-accent"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </FormField>

      {role === "player" && (
        <>
          <FormField label="Hoofdpositie" htmlFor="primary_position">
            <Select value={primaryPosition} onValueChange={setPrimaryPosition}>
              <SelectTrigger className="min-h-[44px]">
                <SelectValue placeholder="Kies een positie" />
              </SelectTrigger>
              <SelectContent>
                {POSITION_GROUPS.map((group) => (
                  <SelectGroup key={group.label}>
                    <SelectLabel>{group.label}</SelectLabel>
                    {group.positions.map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos} - {DETAILED_POSITION_LABELS[pos]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <div>
            <button
              type="button"
              onClick={() => setShowSecondary(!showSecondary)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showSecondary ? "Subposities verbergen" : "Subposities toevoegen"}
              {secondaryPositions.length > 0 && ` (${secondaryPositions.length})`}
            </button>

            {showSecondary && (
              <div className="mt-2 space-y-3">
                {POSITION_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      {group.label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.positions.map((pos) => {
                        const isPrimary = primaryPosition === pos;
                        const isSelected = secondaryPositions.includes(pos);
                        return (
                          <button
                            key={pos}
                            type="button"
                            disabled={isPrimary}
                            onClick={() => toggleSecondary(pos)}
                            className={cn(
                              "min-h-[44px] min-w-[44px] rounded-md border px-3 py-2 text-sm transition-colors",
                              isPrimary && "border-primary/30 bg-primary/10 text-primary/50 cursor-not-allowed",
                              isSelected && !isPrimary && "border-primary bg-primary/10 text-primary font-medium",
                              !isSelected && !isPrimary && "border-input hover:bg-accent"
                            )}
                          >
                            {pos}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <FormField label="Rugnummer" htmlFor="jersey_number">
        <Input
          id="jersey_number"
          name="jersey_number"
          type="number"
          placeholder="bijv. 10"
          min={1}
          max={99}
          defaultValue={defaultValues?.jersey_number ?? undefined}
        />
      </FormField>

      <FormField label="Notities" htmlFor="notes">
        <Textarea
          id="notes"
          name="notes"
          placeholder="Eventuele opmerkingen..."
          rows={3}
          defaultValue={defaultValues?.notes ?? undefined}
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Bezig..." : submitLabel}
      </Button>
    </form>
  );
}
