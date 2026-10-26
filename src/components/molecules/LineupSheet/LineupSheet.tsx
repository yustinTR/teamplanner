import type { ShareLineupPlayer } from "@/lib/share-lineup";
import type { SubstitutionPlan } from "@/types";

interface LineupSheetProps {
  teamName: string;
  opponent: string;
  matchDate: string;
  formation: string;
  players: ShareLineupPlayer[];
  benchNames: string[];
  plan?: SubstitutionPlan | null;
  className?: string;
}

const SHEET_WIDTH = 794; // A4 at 96 dpi
const PITCH_WIDTH = 420;

/**
 * Printable lineup (A4, white) for the dressing-room wall, rendered
 * off-screen for the PDF export. Inline styles only.
 */
export function LineupSheet({
  teamName,
  opponent,
  matchDate,
  formation,
  players,
  benchNames,
  plan,
  className,
}: LineupSheetProps) {
  const date = new Date(matchDate);
  const dateStr = date.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" });
  const timeStr = date.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
  const moments = plan?.substitutionMoments ?? [];
  const minutes = plan?.playerMinutes ?? [];

  return (
    <div
      className={className}
      style={{
        width: SHEET_WIDTH,
        minHeight: 1123,
        boxSizing: "border-box",
        padding: "48px 56px",
        background: "#ffffff",
        color: "#111827",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ borderBottom: "3px solid #16A34A", paddingBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>
          {teamName} <span style={{ color: "#6B7280", fontWeight: 500 }}>vs.</span> {opponent}
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 14, color: "#6B7280" }}>
          {dateStr} · {timeStr} · formatie {formation}
        </p>
      </div>

      <div style={{ display: "flex", gap: 32, marginTop: 28 }}>
        {/* Pitch */}
        <div
          style={{
            position: "relative",
            width: PITCH_WIDTH,
            height: PITCH_WIDTH * (105 / 68),
            flexShrink: 0,
            borderRadius: 8,
            background: "#2d8a4e",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 10, borderRadius: 4, border: "2px solid rgba(255,255,255,0.6)" }} />
          <div style={{ position: "absolute", left: 10, right: 10, top: "50%", height: 1, background: "rgba(255,255,255,0.6)" }} />
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 80, height: 80, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.6)", transform: "translate(-50%, -50%)" }} />
          <div style={{ position: "absolute", left: "20%", right: "20%", top: 10, height: "18%", borderLeft: "2px solid rgba(255,255,255,0.6)", borderRight: "2px solid rgba(255,255,255,0.6)", borderBottom: "2px solid rgba(255,255,255,0.6)" }} />
          <div style={{ position: "absolute", left: "20%", right: "20%", bottom: 10, height: "18%", borderLeft: "2px solid rgba(255,255,255,0.6)", borderRight: "2px solid rgba(255,255,255,0.6)", borderTop: "2px solid rgba(255,255,255,0.6)" }} />
          {players.map((player, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${player.x}%`,
                top: `${player.y}%`,
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "2px solid #ffffff",
                  background: "#ffffff",
                  color: "#16A34A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 800,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }}
              >
                {player.positionLabel}
              </div>
              <span
                style={{
                  marginTop: 3,
                  padding: "1px 6px",
                  borderRadius: 4,
                  background: "rgba(0,0,0,0.45)",
                  color: "#ffffff",
                  fontSize: 11,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  maxWidth: 110,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {player.name}
              </span>
            </div>
          ))}
        </div>

        {/* Side column */}
        <div style={{ flex: 1, fontSize: 13 }}>
          <h2 style={sectionTitle}>Basis</h2>
          <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            {players.map((p, i) => (
              <li key={i}>
                <span style={{ display: "inline-block", width: 32, color: "#6B7280", fontWeight: 600 }}>{p.positionLabel}</span>
                {p.name}
              </li>
            ))}
          </ol>

          <h2 style={{ ...sectionTitle, marginTop: 20 }}>Bank</h2>
          {benchNames.length > 0 ? (
            <p style={{ margin: 0, lineHeight: 1.7 }}>{benchNames.join(", ")}</p>
          ) : (
            <p style={{ margin: 0, color: "#9CA3AF" }}>Geen wissels</p>
          )}
        </div>
      </div>

      {moments.length > 0 && (
        <div style={{ marginTop: 28, display: "flex", gap: 32 }}>
          <div style={{ flex: 1, fontSize: 13 }}>
            <h2 style={sectionTitle}>Wisselschema</h2>
            {moments.map((moment, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "6px 0", borderBottom: "1px solid #F3F4F6" }}>
                <span style={{ minWidth: 36, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{moment.minute}&apos;</span>
                <div>
                  {moment.out.map((outPlayer, j) => (
                    <div key={j}>
                      <span style={{ color: "#DC2626" }}>↓ {outPlayer.name}</span>
                      <span style={{ color: "#9CA3AF", fontSize: 11 }}> ({outPlayer.position_label}) </span>
                      <span style={{ color: "#16A34A" }}>↑ {moment.in[j]?.name ?? "?"}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {minutes.length > 0 && (
            <div style={{ flex: 1, fontSize: 13 }}>
              <h2 style={sectionTitle}>Speelminuten</h2>
              {minutes.map((pm) => (
                <div key={pm.player_id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #F3F4F6" }}>
                  <span>{pm.name}</span>
                  <span style={{ fontVariantNumeric: "tabular-nums", color: "#6B7280" }}>{pm.totalMinutes} min</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <p style={{ marginTop: 40, fontSize: 11, color: "#9CA3AF", textAlign: "center" }}>
        Gemaakt met MyTeamPlanner · myteamplanner.nl · gratis voor je team
      </p>
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  margin: "0 0 6px",
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: 1.5,
  color: "#16A34A",
};
