"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";

interface TeamFormProps {
  defaultValues?: { name?: string; club_name?: string };
  onSubmit: (data: { name: string; club_name: string }) => Promise<void>;
  submitLabel?: string;
}

export function TeamForm({ defaultValues, onSubmit, submitLabel = "Opslaan" }: TeamFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await onSubmit({
      name: formData.get("name") as string,
      club_name: formData.get("club_name") as string,
    });
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Teamnaam</Label>
        <Input
          id="name"
          name="name"
          placeholder="bijv. Heren 1"
          defaultValue={defaultValues?.name}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="club_name">Clubnaam</Label>
        <Input
          id="club_name"
          name="club_name"
          placeholder="bijv. VV De Spartaan"
          defaultValue={defaultValues?.club_name}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Bezig..." : submitLabel}
      </Button>
    </form>
  );
}
