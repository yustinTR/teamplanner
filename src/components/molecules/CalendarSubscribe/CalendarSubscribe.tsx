"use client";

import { useState } from "react";
import { CalendarPlus, Check, Copy } from "lucide-react";
import { trackEvent } from "@/lib/gtm";
import { googleCalendarSubscribeUrl, webcalUrl } from "@/lib/team-calendar";

interface CalendarSubscribeProps {
  /** https URL of the team's `.ics` feed. */
  feedUrl: string;
}

/**
 * Lets parents put the match programme in their phone calendar. The
 * calendar app keeps it up to date; `calendar_subscribe` records which
 * button was used.
 */
export function CalendarSubscribe({ feedUrl }: CalendarSubscribeProps) {
  const [copied, setCopied] = useState(false);
  const track = (target: string) => trackEvent("calendar_subscribe", { target });

  async function copy() {
    track("copy");
    await navigator.clipboard.writeText(feedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const button =
    "inline-flex min-h-[44px] items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors";

  return (
    <section className="rounded-xl bg-white p-4 shadow-md">
      <div className="flex items-start gap-3">
        <CalendarPlus className="mt-0.5 size-5 shrink-0 text-primary-600" />
        <div>
          <h2 className="font-semibold text-neutral-900">Zet de wedstrijden in je agenda</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Eén keer instellen. Verandert er een tijd of valt een wedstrijd af, dan past je agenda zich vanzelf aan.
          </p>
        </div>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <a
          href={webcalUrl(feedUrl)}
          onClick={() => track("apple")}
          className={`${button} bg-primary-600 text-white hover:bg-primary-700`}
        >
          iPhone of Mac
        </a>
        <a
          href={googleCalendarSubscribeUrl(feedUrl)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("google")}
          className={`${button} bg-primary-600 text-white hover:bg-primary-700`}
        >
          Google Agenda
        </a>
        <button
          type="button"
          onClick={copy}
          className={`${button} gap-2 border border-neutral-200 text-neutral-700 hover:bg-neutral-50`}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Gekopieerd" : "Link kopiëren"}
        </button>
      </div>
    </section>
  );
}
