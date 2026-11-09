"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Copy, Share2 } from "lucide-react";
import { ShareSubstitutionPlan } from "@/components/molecules/ShareSubstitutionPlan";
import { useShareImage } from "@/hooks/use-share-image";
import { trackEvent } from "@/lib/gtm";
import { saveToolHandoff } from "@/lib/tool-handoff";
import { buildFairSchedule, MATCH_FORMATS, type FairSchedule } from "@/lib/fair-schedule";

interface SubstitutionScheduleToolProps {
  /** Pre-filled names, one per line (stories and demos). */
  initialNames?: string;
  initialFormat?: string;
}

const fieldClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-base text-neutral-900 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20";

function scheduleAsText(teamName: string, schedule: FairSchedule): string {
  const lines = [`Wisselschema ${teamName}`.trim(), ""];
  lines.push(`Basis: ${schedule.starters.map((s) => `${s.name} (${s.positionLabel})`).join(", ")}`);
  if (schedule.bench.length) lines.push(`Bank: ${schedule.bench.join(", ")}`);
  for (const m of schedule.plan.substitutionMoments) {
    const swaps = m.out.map((o, i) => `${m.in[i].name} voor ${o.name}`).join(", ");
    lines.push(`${m.minute}': ${swaps}`);
  }
  lines.push("", "Speelminuten:");
  for (const p of schedule.plan.playerMinutes) lines.push(`${p.name}: ${p.totalMinutes} min`);
  lines.push("", "Gemaakt met MyTeamPlanner — myteamplanner.nl/tools/wisselschema");
  return lines.join("\n");
}

/**
 * Public substitution-schedule generator: names in, fair rotating schedule
 * out, shareable as the same image the app makes. No account needed.
 */
export function SubstitutionScheduleTool({
  initialNames = "",
  initialFormat = "jo12_jo11",
}: SubstitutionScheduleToolProps) {
  const [formatKey, setFormatKey] = useState(initialFormat);
  const [teamName, setTeamName] = useState("");
  const [namesText, setNamesText] = useState(initialNames);
  const [submitted, setSubmitted] = useState(Boolean(initialNames));
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { share, isGenerating } = useShareImage();

  const format = MATCH_FORMATS.find((f) => f.key === formatKey) ?? MATCH_FORMATS[0];
  const names = useMemo(
    () => [...new Set(namesText.split("\n").map((n) => n.trim()).filter(Boolean))],
    [namesText]
  );
  const missing = format.onPitch - names.length;
  const schedule = useMemo(
    () => (missing <= 0 ? buildFairSchedule({ players: names, format }) : null),
    [names, format, missing]
  );

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (schedule) {
      trackEvent("tool_generate", { tool: "wisselschema", format: format.key, players: String(names.length) });
    }
  }

  async function handleCopy() {
    if (!schedule) return;
    await navigator.clipboard.writeText(scheduleAsText(teamName, schedule));
    trackEvent("tool_copy_text", { tool: "wisselschema" });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const showResult = submitted && schedule;

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
        <div className="space-y-2">
          <label htmlFor="tool-format" className="text-sm font-semibold text-neutral-900">
            Speelvorm
          </label>
          <select
            id="tool-format"
            value={formatKey}
            onChange={(e) => setFormatKey(e.target.value)}
            className={fieldClass}
          >
            {MATCH_FORMATS.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="tool-team" className="text-sm font-semibold text-neutral-900">
            Teamnaam <span className="font-normal text-muted-foreground">(optioneel)</span>
          </label>
          <input
            id="tool-team"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Bijv. JO11-1"
            autoComplete="off"
            className={fieldClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="tool-names" className="text-sm font-semibold text-neutral-900">
            Spelers, één per regel — de eerste is de keeper
          </label>
          <textarea
            id="tool-names"
            value={namesText}
            onChange={(e) => setNamesText(e.target.value)}
            rows={8}
            placeholder={"Sem\nDaan\nLuuk\nFinn\n…"}
            autoComplete="off"
            spellCheck={false}
            className={fieldClass}
          />
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {names.length} {names.length === 1 ? "speler" : "spelers"}
            {missing > 0 ? ` · nog ${missing} nodig voor ${format.onPitch} tegen ${format.onPitch}` : ""}
          </p>
        </div>

        <button
          type="submit"
          disabled={missing > 0}
          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Maak wisselschema
        </button>
      </form>

      {showResult && (
        <section aria-labelledby="tool-result" className="space-y-5">
          <h2 id="tool-result" className="text-xl font-bold text-neutral-900">
            Jouw wisselschema
          </h2>
          <p className="text-sm text-muted-foreground">
            {schedule.plan.substitutionMoments.length === 0
              ? "Geen wissels nodig: iedereen speelt de hele wedstrijd."
              : `${schedule.plan.substitutionMoments.length} wisselmomenten. Verschil in speeltijd tussen veldspelers: ${schedule.spread} ${schedule.spread === 1 ? "minuut" : "minuten"}.`}
          </p>

          <div className="flex justify-center overflow-hidden rounded-2xl bg-neutral-100 p-3">
            <div className="[zoom:0.6] sm:[zoom:0.85]">
              <ShareSubstitutionPlan
                teamName={teamName || "Mijn team"}
                plan={schedule.plan}
              />
            </div>
          </div>

          {/* Full-size copy for html2canvas, kept off-screen. */}
          <div aria-hidden="true" className="pointer-events-none fixed -left-[9999px] top-0">
            <div ref={cardRef}>
              <ShareSubstitutionPlan
                teamName={teamName || "Mijn team"}
                plan={schedule.plan}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => cardRef.current && share(cardRef.current, "wisselschema", "tool_share_image")}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary-600 px-5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
            >
              <Share2 className="size-4" />
              {isGenerating ? "Afbeelding maken…" : "Deel als afbeelding"}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              <Copy className="size-4" />
              {copied ? "Gekopieerd" : "Kopieer als tekst"}
            </button>
          </div>

          <aside className="rounded-2xl bg-primary-50 p-5">
            <p className="font-semibold text-neutral-900">Elke week opnieuw? Bewaar je team.</p>
            <p className="mt-1 text-sm text-neutral-700">
              Maak een gratis account: je {names.length} spelers en de speelvorm staan dan meteen in je
              team. MyTeamPlanner houdt de speelminuten over het hele seizoen bij en laat zien wie er
              beschikbaar is.
            </p>
            <Link
              href="/register"
              onClick={() => {
                saveToolHandoff({ tool: "wisselschema", names, formatKey: format.key, teamName });
                trackEvent("tool_cta_click", { tool: "wisselschema" });
              }}
              className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary-600 px-5 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Bewaar mijn team
              <ArrowRight className="size-4" />
            </Link>
          </aside>
        </section>
      )}
    </div>
  );
}
