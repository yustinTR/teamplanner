import { PlayerCard } from "@/components/atoms/PlayerCard";
import type { CardTier } from "@/lib/player-rating";

interface SharePlayer {
  name: string;
  positionLabel: string;
  x: number;
  y: number;
  overall?: number | null;
  cardTier?: CardTier | null;
}

interface SubstitutionDisplay {
  minute: number;
  changes: { outName: string; inName: string; position: string }[];
}

interface ShareLineupCardProps {
  teamName: string;
  opponent: string;
  matchDate: string;
  formation: string;
  players: SharePlayer[];
  benchNames: string[];
  substitutions?: SubstitutionDisplay[];
  className?: string;
}

export function ShareLineupCard({
  teamName,
  opponent,
  matchDate,
  formation,
  players,
  benchNames,
  substitutions,
  className,
}: ShareLineupCardProps) {
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
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            margin: 0,
            letterSpacing: -0.5,
          }}
        >
          {teamName}
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.7)",
            marginTop: 4,
          }}
        >
          vs. {opponent}
        </p>
        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.45)",
            marginTop: 4,
          }}
        >
          {dateStr} · {timeStr} · {formation}
        </p>
      </div>

      {/* Pitch */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "68/105",
          borderRadius: 12,
          background:
            "linear-gradient(180deg, #2d8a4e 0%, #1e6b3a 30%, #1e6b3a 70%, #2d8a4e 100%)",
          overflow: "hidden",
        }}
      >
        {/* Pitch stripes (subtle mowing pattern) */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={`stripe-${i}`}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${i * 15}%`,
              height: "15%",
              background:
                i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent",
            }}
          />
        ))}

        {/* Outer boundary */}
        <div
          style={{
            position: "absolute",
            inset: 12,
            borderRadius: 4,
            border: "2px solid rgba(255,255,255,0.35)",
          }}
        />
        {/* Halfway line */}
        <div
          style={{
            position: "absolute",
            left: 12,
            right: 12,
            top: "50%",
            height: 1,
            background: "rgba(255,255,255,0.35)",
            transform: "translateY(-50%)",
          }}
        />
        {/* Center circle */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 96,
            height: 96,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.35)",
            transform: "translate(-50%, -50%)",
          }}
        />
        {/* Center dot */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.35)",
            transform: "translate(-50%, -50%)",
          }}
        />
        {/* Top penalty area */}
        <div
          style={{
            position: "absolute",
            left: "20%",
            right: "20%",
            top: 12,
            height: "18%",
            borderLeft: "2px solid rgba(255,255,255,0.35)",
            borderRight: "2px solid rgba(255,255,255,0.35)",
            borderBottom: "2px solid rgba(255,255,255,0.35)",
          }}
        />
        {/* Bottom penalty area */}
        <div
          style={{
            position: "absolute",
            left: "20%",
            right: "20%",
            bottom: 12,
            height: "18%",
            borderLeft: "2px solid rgba(255,255,255,0.35)",
            borderRight: "2px solid rgba(255,255,255,0.35)",
            borderTop: "2px solid rgba(255,255,255,0.35)",
          }}
        />

        {/* Players */}
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
            {player.overall != null && player.cardTier != null ? (
              <PlayerCard
                name={player.name}
                position={player.positionLabel}
                overall={player.overall}
                tier={player.cardTier}
                size="sm"
              />
            ) : (
              <>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: "2px solid #ffffff",
                    background: "#1a56db",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#ffffff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  {player.positionLabel}
                </div>
                <span
                  style={{
                    marginTop: 2,
                    maxWidth: 90,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#ffffff",
                    textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                  }}
                >
                  {player.name}
                </span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Bench */}
      {benchNames.length > 0 && (
        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "rgba(255,255,255,0.5)",
            marginTop: 12,
          }}
        >
          Bank: {benchNames.join(", ")}
        </p>
      )}

      {/* Substitutions */}
      {substitutions && substitutions.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h3
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(255,255,255,0.6)",
              marginBottom: 8,
            }}
          >
            Wissels
          </h3>
          {substitutions.map((sub, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {sub.minute}&apos;
              </span>
              {sub.changes.map((change, j) => (
                <div
                  key={j}
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.7)",
                    marginLeft: 8,
                  }}
                >
                  <span style={{ color: "#ef4444" }}>
                    ↓ {change.outName}
                  </span>{" "}
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>
                    ({change.position})
                  </span>{" "}
                  <span style={{ color: "#22c55e" }}>
                    ↑ {change.inName}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

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
