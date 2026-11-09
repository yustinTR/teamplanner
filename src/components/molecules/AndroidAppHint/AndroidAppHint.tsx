"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Smartphone, X } from "lucide-react";
import { isHintDismissed, dismissHint } from "@/lib/onboarding";
import { trackEvent } from "@/lib/gtm";
import { TEST_DAYS, TESTERS_NEEDED } from "@/lib/android-testing";
import { TesterShareButton } from "@/components/molecules/TesterShareButton";

/**
 * New key for the tester request: users who closed the earlier
 * "also an Android app" notice see this ask once.
 */
export const ANDROID_APP_HINT_KEY = "android_tester_2026_11";

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
 * Dismissible dashboard request to join the Google Play closed test, with a
 * way to forward it to the team. Hidden on iOS and after the user closes it.
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
    trackEvent("android_tester_hint_dismiss");
    setHidden(true);
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-primary-200 bg-primary-50 p-4">
      <Smartphone className="mt-0.5 size-5 shrink-0 text-primary-600" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-primary-900">Help MyTeamPlanner de Play Store in</p>
        <p className="mt-0.5 text-sm text-primary-700">
          Google zet de Android-app pas in de Store als {TESTERS_NEEDED} mensen hem {TEST_DAYS} dagen
          testen. Heb jij of iemand in je team Android? Twee klikken, zelfde account.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/android"
            onClick={() => trackEvent("android_tester_hint_click")}
            className="inline-flex min-h-[44px] items-center rounded-lg bg-primary-700 px-4 text-sm font-semibold text-white hover:bg-primary-800"
          >
            Ik doe mee
          </Link>
          <TesterShareButton placement="dashboard" />
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className="flex size-11 shrink-0 items-center justify-center rounded-md text-primary-400 hover:bg-primary-100 hover:text-primary-600 -mr-2 -mt-2"
        aria-label="Sluiten"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
