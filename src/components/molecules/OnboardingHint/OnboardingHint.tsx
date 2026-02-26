"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { Lightbulb, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { isHintDismissed, dismissHint } from "@/lib/onboarding";

interface OnboardingHintProps {
  hintKey: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}

const subscribe = () => () => {};
const serverSnapshot = () => true;

export function OnboardingHint({
  hintKey,
  title,
  description,
  icon: Icon = Lightbulb,
}: OnboardingHintProps) {
  const dismissed = useSyncExternalStore(
    subscribe,
    useCallback(() => isHintDismissed(hintKey), [hintKey]),
    serverSnapshot,
  );
  const [hidden, setHidden] = useState(false);

  if (dismissed || hidden) return null;

  function handleDismiss() {
    dismissHint(hintKey);
    setHidden(true);
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border border-primary-200 bg-primary-50 p-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-primary-600" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-primary-900">{title}</p>
        <p className="mt-0.5 text-sm text-primary-700">{description}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="shrink-0 rounded-md p-1 text-primary-400 hover:bg-primary-100 hover:text-primary-600"
        aria-label="Sluiten"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
