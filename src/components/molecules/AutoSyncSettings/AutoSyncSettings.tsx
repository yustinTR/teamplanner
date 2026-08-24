"use client";

import { RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatDateShort } from "@/lib/utils";

interface AutoSyncSettingsProps {
  enabled: boolean;
  lastSyncedAt: string | null;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

export function AutoSyncSettings({
  enabled,
  lastSyncedAt,
  onToggle,
  disabled,
}: AutoSyncSettingsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-0.5">
          <Label htmlFor="auto-sync">Automatisch synchroniseren</Label>
          <p className="text-xs text-muted-foreground">
            Haal elke dag nieuwe wedstrijden, tijdwijzigingen en uitslagen op
            van de clubwebsite.
          </p>
        </div>
        <Switch
          id="auto-sync"
          checked={enabled}
          onCheckedChange={onToggle}
          disabled={disabled}
        />
      </div>
      {lastSyncedAt && (
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <RefreshCw className="size-3" aria-hidden="true" />
          Laatste synchronisatie: {formatDateShort(lastSyncedAt)}
        </p>
      )}
    </div>
  );
}
