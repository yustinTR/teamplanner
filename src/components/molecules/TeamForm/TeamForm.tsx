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
import { TEAM_TYPE_LABELS, ACTIVE_TEAM_TYPES } from "@/lib/constants";
import type { TeamType } from "@/types";

interface TeamFormProps {
  defaultValues?: { name?: string; club_name?: string; team_type?: TeamType };
  onSubmit: (data: { name: string; club_name: string; team_type: TeamType }) => Promise<void>;
  submitLabel?: string;
}

export function TeamForm({ defaultValues, onSubmit, submitLabel = "Opslaan" }: TeamFormProps) {
  const [loading, setLoading] = useState(false);
  const [teamType, setTeamType] = useState<TeamType>(defaultValues?.team_type ?? "senioren");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit({
        name: formData.get("name") as string,
        club_name: formData.get("club_name") as string,
        team_type: teamType,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="space-y-2">
        <Label>Teamtype</Label>
        <Select value={teamType} onValueChange={(v) => setTeamType(v as TeamType)}>
          <SelectTrigger>
            <SelectValue placeholder="Kies een teamtype" />
          </SelectTrigger>
          <SelectContent>
            {ACTIVE_TEAM_TYPES.map((value) => (
              <SelectItem key={value} value={value}>
                {TEAM_TYPE_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Bezig..." : submitLabel}
      </Button>
    </form>
  );
}
