import { MadeWithStrip } from "@/components/atoms/MadeWithStrip";
import type { SeasonReview, SeasonReviewEntry } from "@/lib/season-review";

interface ShareSeasonReviewProps {
  teamName: string;
  /** e.g. "2026/27" */
  seasonLabel: string;
  /** e.g. "tot de winterstop"; omitted for a finished season. */
  subtitle?: string;
  review: SeasonReview;
  className?: string;
}

const MEDALS = ["#facc15", "#cbd5e1", "#d97706"];

function TopList({ title, entries, unit }: { title: string; entries: SeasonReviewEntry[]; unit: string }) {
  if (entries.length === 0) return null;
  return (
    <div style={{ borderRadius: 12, background: "rgba(255,255,255,0.06)", padding: "12px 14px" }}>
      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
        {title}
      </p>
      {entries.map((entry, i) => (
        <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
          <span style={{ width: 20, height: 20, borderRadius: 10, background: MEDALS[i], color: "#1a1a2e", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {i + 1}
          </span>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>{entry.name}</span>
          <span style={{ fontSize: 15, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
            {entry.value}
            <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}> {unit}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Off-screen season card rendered by html2canvas. Inline styles only, same
 * as the other share cards.
 */
export function ShareSeasonReview({ teamName, seasonLabel, subtitle, review, className }: ShareSeasonReviewProps) {
  const { summary } = review;
  const tiles = [
    { label: "Gespeeld", value: summary.played },
    { label: "Gewonnen", value: summary.wins },
    { label: "Gelijk", value: summary.draws },
    { label: "Verloren", value: summary.losses },
  ];

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        width: 540,
        overflow: "hidden",
        borderRadius: 16,
        background: "linear-gradient(to bottom, #1a1a2e, #16213e, #0f3460)",
        padding: 24,
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#facc15" }}>
          Seizoen {seasonLabel}
          {subtitle ? ` · ${subtitle}` : ""}
        </p>
        <h2 style={{ fontSize: 26, fontWeight: 800, margin: "6px 0 0", letterSpacing: -0.5 }}>{teamName}</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {tiles.map((t) => (
          <div key={t.label} style={{ borderRadius: 12, background: "rgba(255,255,255,0.08)", padding: "10px 4px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{t.value}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{t.label}</div>
          </div>
        ))}
      </div>
      <p style={{ textAlign: "center", fontSize: 14, color: "rgba(255,255,255,0.75)", margin: "12px 0 16px" }}>
        Doelpunten <strong style={{ color: "#ffffff" }}>{summary.goalsFor}</strong> voor ·{" "}
        <strong style={{ color: "#ffffff" }}>{summary.goalsAgainst}</strong> tegen
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <TopList title="Topscorers" entries={review.topScorers} unit="goals" />
        <TopList title="Assists" entries={review.topAssists} unit="assists" />
        <TopList title="Altijd beschikbaar" entries={review.bestAttendance} unit="%" />
      </div>

      <MadeWithStrip />
    </div>
  );
}
