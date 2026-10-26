import { MadeWithStrip } from "@/components/atoms/MadeWithStrip";
import type { SubstitutionPlan } from "@/types";

interface ShareSubstitutionPlanProps {
  teamName: string;
  opponent: string;
  matchDate: string;
  plan: SubstitutionPlan;
  className?: string;
}

/**
 * Off-screen card rendered by html2canvas when the coach shares the
 * substitution plan. Inline styles only, same as the other share cards.
 */
export function ShareSubstitutionPlan({
  teamName,
  opponent,
  matchDate,
  plan,
  className,
}: ShareSubstitutionPlanProps) {
  const date = new Date(matchDate);
  const dateStr = date.toLocaleDateString("nl-NL", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const timeStr = date.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  });

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
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>
          Wisselschema
        </h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
          {teamName} vs. {opponent}
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
          {dateStr} · {timeStr} · {plan.totalMinutes} min
        </p>
      </div>

      {plan.substitutionMoments.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {plan.substitutionMoments.map((moment, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 12,
                borderRadius: 10,
                background: "rgba(255,255,255,0.06)",
                padding: "10px 12px",
              }}
            >
              <span
                style={{
                  minWidth: 36,
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#facc15",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {moment.minute}&apos;
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
                {moment.out.map((outPlayer, j) => {
                  const inPlayer = moment.in[j];
                  return (
                    <div key={j} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                      <span style={{ color: "#f87171" }}>↓ {outPlayer.name}</span>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
                        ({outPlayer.position_label})
                      </span>
                      <span style={{ color: "#4ade80" }}>↑ {inPlayer?.name ?? "?"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <h3
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            color: "rgba(255,255,255,0.35)",
            marginBottom: 8,
          }}
        >
          Speelminuten
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {plan.playerMinutes.map((pm) => (
            <div key={pm.player_id}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  marginBottom: 3,
                }}
              >
                <span style={{ fontWeight: 600 }}>{pm.name}</span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontVariantNumeric: "tabular-nums" }}>
                  {pm.totalMinutes} min
                </span>
              </div>
              <div
                style={{
                  position: "relative",
                  height: 8,
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.12)",
                  overflow: "hidden",
                }}
              >
                {pm.periods.map((period, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: `${(period.start / plan.totalMinutes) * 100}%`,
                      width: `${((period.end - period.start) / plan.totalMinutes) * 100}%`,
                      background: "#22c55e",
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <MadeWithStrip />
    </div>
  );
}
