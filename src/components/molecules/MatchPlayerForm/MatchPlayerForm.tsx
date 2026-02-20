"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { POSITION_LABELS } from "@/lib/constants";

interface MatchPlayerFormProps {
  onSubmit: (data: { name: string; position: string | null }) => Promise<void>;
}

export function MatchPlayerForm({ onSubmit }: MatchPlayerFormProps) {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit({
        name: formData.get("name") as string,
        position: position || null,
      });
      e.currentTarget.reset();
      setPosition("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mp-name">Naam</Label>
        <Input
          id="mp-name"
          name="name"
          placeholder="Naam van de leen-speler"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Positie</Label>
        <Select value={position} onValueChange={setPosition}>
          <SelectTrigger>
            <SelectValue placeholder="Kies een positie (optioneel)" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(POSITION_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Toevoegen..." : "Leen-speler toevoegen"}
      </Button>
    </form>
  );
}
