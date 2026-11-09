"use client";

import { ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/gtm";
import { TESTER_GROUP_URL, TESTER_OPT_IN_URL } from "@/lib/android-testing";

const steps = [
  {
    key: "group",
    title: "Word lid van de testgroep",
    body: "Open de Google-groep en klik op “Lid worden”. Je hebt alleen een Google-account nodig; de groep stuurt geen e-mails.",
    href: TESTER_GROUP_URL,
    label: "Naar de Google-groep",
  },
  {
    key: "opt_in",
    title: "Meld je aan als tester en installeer",
    body: "Open de testpagina, klik op “Tester worden” en installeer MyTeamPlanner uit de Play Store. Laat de app daarna gewoon op je telefoon staan.",
    href: TESTER_OPT_IN_URL,
    label: "Naar de testpagina",
  },
];

/**
 * The two Play closed-test steps. Each click pushes `android_tester_step`
 * so GTM shows how far visitors get.
 */
export function AndroidTesterSteps() {
  return (
    <ol className="space-y-6">
      {steps.map((step, index) => (
        <li key={step.key} className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-700 text-sm font-semibold text-white">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-neutral-900">{step.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              <a
                href={step.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("android_tester_step", { step: step.key })}
                className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-primary-700 px-4 text-sm font-semibold text-white hover:bg-primary-800"
              >
                {step.label}
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
