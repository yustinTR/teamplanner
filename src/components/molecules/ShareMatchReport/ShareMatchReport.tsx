interface StatEntry {
  playerName: string;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
}

interface ShareMatchReportProps {
  teamName: string;
  opponent: string;
  homeAway: "home" | "away";
  matchDate: string;
  scoreHome: number;
  scoreAway: number;
  stats: StatEntry[];
  className?: string;
}

export function ShareMatchReport({
  teamName,
  opponent,
  homeAway,
  matchDate,
  scoreHome,
  scoreAway,
  stats,
  className,
}: ShareMatchReportProps) {
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

  const homeName = homeAway === "home" ? teamName : opponent;
  const awayName = homeAway === "away" ? teamName : opponent;

  const goalScorers = stats.filter((s) => s.goals > 0);
  const assistMakers = stats.filter((s) => s.assists > 0);
  const yellowCards = stats.filter((s) => s.yellow_cards > 0);
  const redCards = stats.filter((s) => s.red_cards > 0);

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
      {/* Date */}
      <p
        style={{
          textAlign: "center",
          fontSize: 13,
          color: "rgba(255,255,255,0.45)",
        }}
      >
        {dateStr} · {timeStr}
      </p>

      {/* Score */}
      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 600 }}>{homeName}</span>
          <span
            style={{
              fontSize: 40,
              fontWeight: 800,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {scoreHome} - {scoreAway}
          </span>
          <span style={{ fontSize: 18, fontWeight: 600 }}>{awayName}</span>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 16,
        }}
      >
        {goalScorers.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <h3
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                color: "rgba(255,255,255,0.35)",
                marginBottom: 4,
              }}
            >
              Doelpunten
            </h3>
            {goalScorers.map((s) => (
              <p
                key={s.playerName}
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.8)",
                  margin: "2px 0",
                }}
              >
                {s.playerName} {s.goals > 1 ? `(${s.goals}x)` : ""}
              </p>
            ))}
          </div>
        )}

        {assistMakers.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <h3
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                color: "rgba(255,255,255,0.35)",
                marginBottom: 4,
              }}
            >
              Assists
            </h3>
            {assistMakers.map((s) => (
              <p
                key={s.playerName}
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.8)",
                  margin: "2px 0",
                }}
              >
                {s.playerName} {s.assists > 1 ? `(${s.assists}x)` : ""}
              </p>
            ))}
          </div>
        )}

        {(yellowCards.length > 0 || redCards.length > 0) && (
          <div style={{ marginBottom: 12 }}>
            <h3
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                color: "rgba(255,255,255,0.35)",
                marginBottom: 4,
              }}
            >
              Kaarten
            </h3>
            {yellowCards.map((s) => (
              <p
                key={`y-${s.playerName}`}
                style={{ fontSize: 14, color: "#facc15", margin: "2px 0" }}
              >
                {s.playerName}
              </p>
            ))}
            {redCards.map((s) => (
              <p
                key={`r-${s.playerName}`}
                style={{ fontSize: 14, color: "#ef4444", margin: "2px 0" }}
              >
                {s.playerName}
              </p>
            ))}
          </div>
        )}

        {goalScorers.length === 0 &&
          assistMakers.length === 0 &&
          yellowCards.length === 0 &&
          redCards.length === 0 && (
            <p
              style={{
                textAlign: "center",
                fontSize: 14,
                color: "rgba(255,255,255,0.35)",
              }}
            >
              Geen statistieken ingevuld.
            </p>
          )}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 16,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 12,
          textAlign: "center",
          fontSize: 11,
          color: "rgba(255,255,255,0.25)",
        }}
      >
        myteamplanner.nl
      </div>
    </div>
  );
}
