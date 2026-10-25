"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Smartphone, X } from "lucide-react";
import { isHintDismissed, dismissHint } from "@/lib/onboarding";

export const ANDROID_APP_HINT_KEY = "android_app";

interface AndroidAppHintProps {
  /** Override platform detection (used by stories/tests). */
  forceVisible?: boolean;
}

const subscribe = () => () => {};
const serverSnapshot = () => true;

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

/**
 * Dismissible dashboard notice pointing logged-in users to the Android app.
 * Hidden on iOS (no app there) and after the user closes it.
 */
export function AndroidAppHint({ forceVisible = false }: AndroidAppHintProps) {
  const dismissed = useSyncExternalStore(
    subscribe,
    useCallback(() => isHintDismissed(ANDROID_APP_HINT_KEY), []),
    serverSnapshot,
  );
  const [hidden, setHidden] = useState(false);

  if (!forceVisible && (dismissed || hidden || isIos())) return null;
  if (forceVisible && hidden) return null;

  function handleDismiss() {
    dismissHint(ANDROID_APP_HINT_KEY);
    setHidden(true);
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-primary-200 bg-primary-50 p-4">
      <Smartphone className="mt-0.5 size-5 shrink-0 text-primary-600" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-primary-900">MyTeamPlanner is er ook als Android-app</p>
        <p className="mt-0.5 text-sm text-primary-700">
          Gratis via Google Play, met meldingen voor beschikbaarheid en opstellingen. Zelfde account.
        </p>
        <Link
          href="/android"
          className="mt-2 inline-flex min-h-[44px] items-center text-sm font-semibold text-primary-800 underline-offset-4 hover:underline"
        >
          Zo installeer je de app
        </Link>
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
