"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Copy, Share2 } from "lucide-react";
import { ShareLineupCard } from "@/components/molecules/ShareLineupCard";
import { useShareImage } from "@/hooks/use-share-image";
import { trackEvent } from "@/lib/gtm";
import { FORMATIONS_11, FORMATIONS_8, FORMATIONS_7, FORMATIONS_6 } from "@/lib/constants";
import { MATCH_FORMATS } from "@/lib/fair-schedule";

interface LineupMakerToolProps {
  initialNames?: string;
  initialFormat?: string;
}

const FORMATION_SETS = { 11: FORMATIONS_11, 8: FORMATIONS_8, 7: FORMATIONS_7, 6: FORMATIONS_6 } as const;

const fieldClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-base text-neutral-900 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20";

/**
 * Public lineup maker: pick a format and formation, enter names, and share
 * the same lineup image the app makes. Names fill the positions in order and
 * can be swapped per position. No account needed.
 */
export function LineupMakerTool({ initialNames = "", initialFormat = "senioren" }: LineupMakerToolProps) {
  const [formatKey, setFormatKey] = useState(initialFormat);
  const format = MATCH_FORMATS.find((f) => f.key === formatKey) ?? MATCH_FORMATS[0];
  const formations = FORMATION_SETS[format.onPitch as keyof typeof FORMATION_SETS];
  const [formation, setFormation] = useState(format.formation);
  const [teamName, setTeamName] = useState("");
  const [namesText, setNamesText] = useState(initialNames);
  const [overrides, setOverrides] = useState<Record<number, string>>({});
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { share, isGenerating } = useShareImage();

  const activeFormation = formations[formation] ? formation : format.formation;
  const positions = formations[activeFormation];
  const names = useMemo(
    () => [...new Set(namesText.split("\n").map((n) => n.trim()).filter(Boolean))],
    [namesText]
  );

  const assigned = positions.map((_, i) => {
    const override = overrides[i];
    return override && names.includes(override) ? override : null;
  });
  const remaining = names.filter((n) => !assigned.includes(n));
  const lineup = assigned.map((name) => name ?? remaining.shift() ?? "");
  const bench = names.filter((n) => !lineup.includes(n));

  const players = positions
    .map((pos, i) => ({ name: lineup[i], positionLabel: pos.position_label, x: pos.x, y: pos.y }))
    .filter((p) => p.name);
  const ready = players.length === positions.length;

  function changeFormat(key: string) {
    const next = MATCH_FORMATS.find((f) => f.key === key) ?? MATCH_FORMATS[0];
    setFormatKey(key);
    setFormation(next.formation);
    setOverrides({});
  }

  function lineupAsText(): string {
    const lines = [`Opstelling ${teamName}`.trim() + ` (${activeFormation})`, ""];
    players.forEach((p) => lines.push(`${p.positionLabel}: ${p.name}`));
    if (bench.length) lines.push("", `Bank: ${bench.join(", ")}`);
    lines.push("", "Gemaakt met MyTeamPlanner — myteamplanner.nl/tools/opstelling");
    return lines.join("\n");
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(lineupAsText());
    trackEvent("tool_copy_text", { tool: "opstelling" });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const card = (
    <ShareLineupCard
      teamName={teamName || "Mijn team"}
      formation={activeFormation}
      players={players}
      benchNames={bench}
    />
  );

  return (
    <div className="space-y-8">
      <div className="space-y-5 rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="lineup-format" className="text-sm font-semibold text-neutral-900">
              Speelvorm
            </label>
            <select id="lineup-format" value={formatKey} onChange={(e) => changeFormat(e.target.value)} className={fieldClass}>
              {MATCH_FORMATS.map((f) => (
                <option key={f.key} value={f.key}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="lineup-formation" className="text-sm font-semibold text-neutral-900">
              Formatie
            </label>
            <select
              id="lineup-formation"
              value={activeFormation}
              onChange={(e) => {
                setFormation(e.target.value);
                setOverrides({});
              }}
              className={fieldClass}
            >
              {Object.keys(formations).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="lineup-team" className="text-sm font-semibold text-neutral-900">
            Teamnaam <span className="font-normal text-muted-foreground">(optioneel)</span>
          </label>
          <input
            id="lineup-team"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Bijv. Zaterdag 3"
            autoComplete="off"
            className={fieldClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="lineup-names" className="text-sm font-semibold text-neutral-900">
            Spelers, één per regel — in de volgorde keeper, verdediging, middenveld, aanval
          </label>
          <textarea
            id="lineup-names"
            value={namesText}
            onChange={(e) => setNamesText(e.target.value)}
            rows={8}
            placeholder={"Sem\nDaan\nLuuk\n…"}
            autoComplete="off"
            spellCheck={false}
            className={fieldClass}
          />
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {names.length} {names.length === 1 ? "speler" : "spelers"}
            {!ready ? ` · nog ${positions.length - players.length} nodig voor ${format.onPitch} tegen ${format.onPitch}` : ""}
            {bench.length ? ` · ${bench.length} op de bank` : ""}
          </p>
        </div>

        {names.length > 0 && (
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-neutral-900">Wie staat waar?</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {positions.map((pos, i) => (
                <label key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-10 shrink-0 font-semibold text-neutral-600">{pos.position_label}</span>
                  <select
                    value={lineup[i]}
                    onChange={(e) => {
                      const name = e.target.value;
                      // A player stands in one place: drop the name from any other pinned position.
                      setOverrides((o) => ({
                        ...Object.fromEntries(Object.entries(o).filter(([, n]) => n !== name)),
                        [i]: name,
                      }));
                    }}
                    className={fieldClass}
                    aria-label={`Speler op positie ${pos.position_label} (${i + 1})`}
                  >
                    {!lineup[i] && <option value="">—</option>}
                    {names.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      {ready && (
        <section aria-labelledby="lineup-result" className="space-y-5">
          <h2 id="lineup-result" className="text-xl font-bold text-neutral-900">
            Jouw opstelling
          </h2>
          <div className="flex justify-center overflow-hidden rounded-2xl bg-neutral-100 p-3">
            <div className="[zoom:0.6] sm:[zoom:0.85]">{card}</div>
          </div>
          <div aria-hidden="true" className="pointer-events-none fixed -left-[9999px] top-0">
            <div ref={cardRef}>{card}</div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => cardRef.current && share(cardRef.current, "opstelling", "tool_share_image")}
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
            <p className="font-semibold text-neutral-900">Wil je ook zien wie er kan?</p>
            <p className="mt-1 text-sm text-neutral-700">
              Met een gratis account geven je spelers hun beschikbaarheid door en maak je de
              opstelling alleen met wie er is — inclusief wisselschema en speelminuten.
            </p>
            <Link
              href="/register"
              onClick={() => trackEvent("tool_cta_click", { tool: "opstelling" })}
              className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary-600 px-5 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Gratis account maken
              <ArrowRight className="size-4" />
            </Link>
          </aside>
        </section>
      )}
    </div>
  );
}
