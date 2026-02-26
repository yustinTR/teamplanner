"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Check, Circle, X, Rocket } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { usePlayers } from "@/hooks/use-players";
import { useMatches } from "@/hooks/use-matches";
import {
  isChecklistDismissed,
  dismissChecklist,
  hasVisitedInvite,
} from "@/lib/onboarding";

interface Step {
  label: string;
  href: string;
  completed: boolean;
}

const subscribe = () => () => {};
const getChecklistDismissed = () => isChecklistDismissed();
const getInviteVisited = () => hasVisitedInvite();
const serverDismissed = () => true;
const serverInviteVisited = () => false;

export function OnboardingChecklist() {
  const { isCoach, currentTeam } = useAuthStore();
  const { data: players } = usePlayers(currentTeam?.id);
  const { data: matches } = useMatches(currentTeam?.id);
  const dismissed = useSyncExternalStore(subscribe, getChecklistDismissed, serverDismissed);
  const inviteVisited = useSyncExternalStore(subscribe, getInviteVisited, serverInviteVisited);
  const [manualDismissed, setManualDismissed] = useState(false);

  if (!isCoach || !currentTeam || dismissed || manualDismissed) return null;

  const steps: Step[] = [
    {
      label: "Team aangemaakt",
      href: "/team",
      completed: true,
    },
    {
      label: "Spelers toevoegen",
      href: "/team",
      completed: (players?.length ?? 0) >= 1,
    },
    {
      label: "Eerste wedstrijd plannen",
      href: "/matches",
      completed: (matches?.length ?? 0) >= 1,
    },
    {
      label: "Uitnodigingslink delen",
      href: "/team/settings",
      completed: inviteVisited,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const allDone = completedCount === steps.length;

  if (allDone) return null;

  function handleDismiss() {
    dismissChecklist();
    setManualDismissed(true);
  }

  return (
    <div className="rounded-xl border border-primary-200 bg-primary-50 p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Rocket className="size-5 text-primary-600" />
          <h3 className="font-semibold text-primary-900">Aan de slag</h3>
        </div>
        <button
          onClick={handleDismiss}
          className="rounded-md p-1 text-primary-400 hover:bg-primary-100 hover:text-primary-600"
          aria-label="Sluiten"
        >
          <X className="size-4" />
        </button>
      </div>

      <p className="mb-3 text-sm text-primary-700">
        {completedCount} van {steps.length} stappen voltooid
      </p>

      <div className="space-y-2">
        {steps.map((step) => (
          <Link
            key={step.label}
            href={step.href}
            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-primary-100"
          >
            {step.completed ? (
              <Check className="size-5 text-success-600" />
            ) : (
              <Circle className="size-5 text-primary-300" />
            )}
            <span
              className={
                step.completed
                  ? "text-sm text-primary-500 line-through"
                  : "text-sm font-medium text-primary-900"
              }
            >
              {step.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
