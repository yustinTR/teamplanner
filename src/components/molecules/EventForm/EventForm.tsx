"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";

interface EventFormData {
  title: string;
  description: string;
  event_date: string;
  end_date: string;
  location: string;
  notes: string;
}

interface EventFormProps {
  defaultValues?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => Promise<void>;
  submitLabel?: string;
}

export function EventForm({ defaultValues, onSubmit, submitLabel = "Opslaan" }: EventFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      await onSubmit({
        title: fd.get("title") as string,
        description: fd.get("description") as string,
        event_date: fd.get("event_date") as string,
        end_date: fd.get("end_date") as string,
        location: fd.get("location") as string,
        notes: fd.get("notes") as string,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ev-title">Titel</Label>
        <Input
          id="ev-title"
          name="title"
          placeholder="bijv. Kersttoernooi"
          defaultValue={defaultValues?.title}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ev-description">Beschrijving</Label>
        <Input
          id="ev-description"
          name="description"
          placeholder="Waar gaat het evenement over?"
          defaultValue={defaultValues?.description}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="ev-date">Datum &amp; tijd</Label>
          <Input
            id="ev-date"
            name="event_date"
            type="datetime-local"
            defaultValue={defaultValues?.event_date?.slice(0, 16)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ev-end-date">Einddatum</Label>
          <Input
            id="ev-end-date"
            name="end_date"
            type="datetime-local"
            defaultValue={defaultValues?.end_date?.slice(0, 16)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ev-location">Locatie</Label>
        <Input
          id="ev-location"
          name="location"
          placeholder="bijv. Sportpark De Toekomst"
          defaultValue={defaultValues?.location}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ev-notes">Notities</Label>
        <Input
          id="ev-notes"
          name="notes"
          placeholder="Extra informatie"
          defaultValue={defaultValues?.notes}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Bezig..." : submitLabel}
      </Button>
    </form>
  );
}
