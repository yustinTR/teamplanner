"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import { trackEvent } from "@/lib/gtm";

interface ExerciseSignupCtaProps {
  /** Exercise id; after sign-up or login the coach lands on it in the app. */
  exerciseId: string;
  exerciseSlug: string;
}

/**
 * Sign-up prompt on a public exercise page. Pushes `exercise_cta_click`
 * with the exercise slug so GTM can tell which exercises convert.
 */
export function ExerciseSignupCta({ exerciseId, exerciseSlug }: ExerciseSignupCtaProps) {
  const next = encodeURIComponent(`/trainingen/oefeningen/${exerciseId}`);
  const track = (target: string) =>
    trackEvent("exercise_cta_click", { slug: exerciseSlug, target });

  return (
    <div className="rounded-2xl border border-primary-100 bg-primary-50 p-5">
      <div className="flex items-start gap-3">
        <ClipboardList className="mt-0.5 size-6 shrink-0 text-primary-600" />
        <div>
          <h2 className="font-semibold text-neutral-900">Zet deze oefening in je trainingsplan</h2>
          <p className="mt-1 text-sm leading-relaxed text-neutral-600">
            Stel in twee minuten een training samen uit 79 oefeningen, koppel hem aan je
            trainingsavond en zie wie er komt. Gratis voor je hele team.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Link
          href={`/register?next=${next}`}
          onClick={() => track("register")}
          className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg bg-primary-600 px-5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          Gratis account maken
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href={`/login?next=${next}`}
          onClick={() => track("login")}
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg px-4 text-sm font-medium text-primary-700 hover:bg-primary-100"
        >
          Ik heb al een account
        </Link>
      </div>
    </div>
  );
}
