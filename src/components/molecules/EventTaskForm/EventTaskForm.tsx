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
import type { Player } from "@/types";

interface EventTaskFormProps {
  players?: Player[];
  onSubmit: (data: {
    title: string;
    description: string;
    assigned_to: string | null;
    deadline: string;
  }) => Promise<void>;
}

export function EventTaskForm({ players, onSubmit }: EventTaskFormProps) {
  const [loading, setLoading] = useState(false);
  const [assignedTo, setAssignedTo] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      await onSubmit({
        title: fd.get("title") as string,
        description: fd.get("description") as string,
        assigned_to: assignedTo || null,
        deadline: fd.get("deadline") as string,
      });
      e.currentTarget.reset();
      setAssignedTo("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="task-title">Taak</Label>
        <Input
          id="task-title"
          name="title"
          placeholder="bijv. Bier regelen"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-desc">Beschrijving</Label>
        <Input
          id="task-desc"
          name="description"
          placeholder="Extra details (optioneel)"
        />
      </div>

      {players && players.length > 0 && (
        <div className="space-y-2">
          <Label>Toewijzen aan</Label>
          <Select value={assignedTo} onValueChange={setAssignedTo}>
            <SelectTrigger>
              <SelectValue placeholder="Kies een speler (optioneel)" />
            </SelectTrigger>
            <SelectContent>
              {players.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="task-deadline">Deadline</Label>
        <Input
          id="task-deadline"
          name="deadline"
          type="datetime-local"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Toevoegen..." : "Taak toevoegen"}
      </Button>
    </form>
  );
}
