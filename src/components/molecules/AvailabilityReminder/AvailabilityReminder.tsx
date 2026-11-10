"use client";

import { useState } from "react";
import { BellRing, Check } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { availabilityReminderText } from "@/lib/availability-reminder";
import { trackEvent } from "@/lib/gtm";

interface AvailabilityReminderProps {
  /** Players who have not answered yet. */
  names: string[];
  opponent: string;
  matchDate: string;
  homeAway: "home" | "away";
  /** "/matches/<id>"; made absolute when shared. */
  matchPath: string;
}

/**
 * Lets the coach send one ready-made reminder to the team chat, naming the
 * players who have not answered. Uses the share sheet, or copies the text.
 */
export function AvailabilityReminder({ names, opponent, matchDate, homeAway, matchPath }: AvailabilityReminderProps) {
  const [copied, setCopied] = useState(false);

  if (!names.length) return null;

  async function handleClick() {
    const text = availabilityReminderText(names, {
      opponent,
      matchDate,
      homeAway,
      matchUrl: `${window.location.origin}${matchPath}`,
    });
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ text });
        trackEvent("availability_reminder", { method: "native", players: String(names.length) });
      } catch {
        // Share sheet closed without sharing.
      }
      return;
    }
    await navigator.clipboard.writeText(text);
    trackEvent("availability_reminder", { method: "clipboard", players: String(names.length) });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button variant="outline" className="w-full gap-2" onClick={handleClick}>
      {copied ? <Check className="size-4" /> : <BellRing className="size-4" />}
      {copied ? "Bericht gekopieerd" : `Herinner wie nog niet reageerde (${names.length})`}
    </Button>
  );
}
