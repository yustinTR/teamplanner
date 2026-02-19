"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { FormField } from "@/components/molecules/FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { POSITION_LABELS } from "@/lib/constants";

interface PlayerFormData {
  name: string;
  position: string | null;
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
  const [position, setPosition] = useState<string>(defaultValues?.position ?? "");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const jerseyNum = formData.get("jersey_number") as string;
    await onSubmit({
      name: formData.get("name") as string,
      position: position || null,
      jersey_number: jerseyNum ? parseInt(jerseyNum, 10) : null,
      notes: (formData.get("notes") as string) || null,
    });
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <FormField label="Naam" htmlFor="name">
        <Input
          id="name"
          name="name"
          placeholder="Volledige naam"
          defaultValue={defaultValues?.name}
          required
        />
      </FormField>

      <FormField label="Positie" htmlFor="position">
        <Select value={position} onValueChange={setPosition}>
          <SelectTrigger className="min-h-[44px]">
            <SelectValue placeholder="Kies een positie" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(POSITION_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

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
