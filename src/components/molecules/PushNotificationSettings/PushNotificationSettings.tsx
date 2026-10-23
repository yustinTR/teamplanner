"use client";

import { Bell, BellOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { PushStatus } from "@/hooks/use-push-subscription";

interface PushNotificationSettingsProps {
  status: PushStatus | "loading";
  pending?: boolean;
  /** iPhone without the PWA on the home screen: explain why it will not work. */
  showIosHint?: boolean;
  onEnable: () => void;
  onDisable: () => void;
}

export function PushNotificationSettings({
  status,
  pending = false,
  showIosHint = false,
  onEnable,
  onDisable,
}: PushNotificationSettingsProps) {
  const enabled = status === "subscribed";
  const canToggle = status === "subscribed" || status === "unsubscribed";
  const Icon = enabled ? Bell : BellOff;

  let note: string | null = null;
  if (status === "unsupported") {
    note = showIosHint
      ? "Op een iPhone werken meldingen alleen als je de app op je beginscherm hebt gezet. Open de deelknop in Safari en kies 'Zet op beginscherm'."
      : "Meldingen worden in deze browser niet ondersteund.";
  } else if (status === "denied") {
    note = "Meldingen zijn geblokkeerd. Zet ze aan in de instellingen van je browser.";
  }

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <Icon className="mt-0.5 size-5 shrink-0 text-primary-600" />
          <div className="min-w-0">
            <Label htmlFor="push-toggle" className="font-medium text-neutral-900">
              Meldingen
            </Label>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Herinnering voor je beschikbaarheid, de opstelling en wijzigingen in het programma.
            </p>
          </div>
        </div>
        <Switch
          id="push-toggle"
          checked={enabled}
          disabled={!canToggle || pending}
          onCheckedChange={(checked) => (checked ? onEnable() : onDisable())}
          aria-label="Meldingen aan of uit"
        />
      </div>
      {note && <p className="mt-3 text-sm text-neutral-600">{note}</p>}
    </div>
  );
}
