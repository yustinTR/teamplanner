"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";

interface TrainingPlanFormData {
  title: string;
  notes: string;
}

interface TrainingPlanFormProps {
  defaultValues?: Partial<TrainingPlanFormData>;
  onSubmit: (data: TrainingPlanFormData) => Promise<void>;
  submitLabel?: string;
}

export function TrainingPlanForm({ defaultValues, onSubmit, submitLabel = "Opslaan" }: TrainingPlanFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      await onSubmit({
        title: fd.get("title") as string,
        notes: fd.get("notes") as string,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tp-title">Titel</Label>
        <Input
          id="tp-title"
          name="title"
          placeholder="bijv. Passing & positiespel"
          defaultValue={defaultValues?.title}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tp-notes">Notities</Label>
        <Input
          id="tp-notes"
          name="notes"
          placeholder="Extra informatie of aandachtspunten"
          defaultValue={defaultValues?.notes}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Bezig..." : submitLabel}
      </Button>
    </form>
  );
}
