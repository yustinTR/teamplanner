"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { FormField } from "@/components/molecules/FormField";
import { HOME_AWAY_LABELS } from "@/lib/constants";
import { toDatetimeLocal } from "@/lib/utils";
import type { HomeAway } from "@/types";

interface MatchFormData {
  opponent: string;
  match_date: string;
  location: string | null;
  home_away: HomeAway;
  notes: string | null;
}

interface MatchFormProps {
  defaultValues?: Partial<MatchFormData>;
  onSubmit: (data: MatchFormData) => Promise<void>;
  submitLabel?: string;
}

export function MatchForm({
  defaultValues,
  onSubmit,
  submitLabel = "Opslaan",
}: MatchFormProps) {
  const [loading, setLoading] = useState(false);
  const [homeAway, setHomeAway] = useState<HomeAway>(defaultValues?.home_away ?? "home");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit({
        opponent: formData.get("opponent") as string,
        match_date: new Date(formData.get("match_date") as string).toISOString(),
        location: (formData.get("location") as string) || null,
        home_away: homeAway,
        notes: (formData.get("notes") as string) || null,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Tegenstander" htmlFor="opponent">
        <Input
          id="opponent"
          name="opponent"
          placeholder="bijv. FC Vooruit"
          defaultValue={defaultValues?.opponent}
          required
        />
      </FormField>

      <FormField label="Datum en tijd" htmlFor="match_date">
        <Input
          id="match_date"
          name="match_date"
          type="datetime-local"
          defaultValue={defaultValues?.match_date ? toDatetimeLocal(defaultValues.match_date) : undefined}
          required
        />
      </FormField>

      <FormField label="Locatie" htmlFor="location">
        <Input
          id="location"
          name="location"
          placeholder="bijv. Sportpark De Toekomst"
          defaultValue={defaultValues?.location ?? undefined}
        />
      </FormField>

      <FormField label="Thuis / Uit">
        <div className="flex gap-2">
          {(Object.entries(HOME_AWAY_LABELS) as [HomeAway, string][]).map(
            ([value, label]) => (
              <Button
                key={value}
                type="button"
                variant={homeAway === value ? "default" : "outline"}
                className="flex-1"
                onClick={() => setHomeAway(value)}
              >
                {label}
              </Button>
            )
          )}
        </div>
      </FormField>

      <FormField label="Notities" htmlFor="notes">
        <Textarea
          id="notes"
          name="notes"
          placeholder="Eventuele opmerkingen..."
          rows={2}
          defaultValue={defaultValues?.notes ?? undefined}
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Bezig..." : submitLabel}
      </Button>
    </form>
  );
}
