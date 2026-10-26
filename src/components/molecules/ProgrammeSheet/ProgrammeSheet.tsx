import { calculateGatheringTime, formatTime } from "@/lib/utils";
import { HOME_AWAY_LABELS } from "@/lib/constants";
import type { Match } from "@/types";

interface ProgrammeSheetProps {
  teamName: string;
  matches: Match[];
  defaultGatheringMinutes: number;
  className?: string;
}

const SHEET_WIDTH = 794; // A4 at 96 dpi

/**
 * Printable match programme (A4, white) rendered off-screen for the PDF
 * export. Inline styles only, like the share cards.
 */
export function ProgrammeSheet({
  teamName,
  matches,
  defaultGatheringMinutes,
  className,
}: ProgrammeSheetProps) {
  const groups = groupByMonth(matches);

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
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderBottom: "3px solid #16A34A", paddingBottom: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>{teamName}</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#6B7280" }}>Wedstrijdprogramma</p>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>
          {matches.length} {matches.length === 1 ? "wedstrijd" : "wedstrijden"}
        </p>
      </div>

      {groups.length === 0 && (
        <p style={{ marginTop: 32, fontSize: 14, color: "#6B7280" }}>Geen aankomende wedstrijden.</p>
      )}

      {groups.map(([month, monthMatches]) => (
        <div key={month} style={{ marginTop: 28 }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#16A34A" }}>
            {month}
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ color: "#6B7280", textAlign: "left" }}>
                <th style={cell(true)}>Datum</th>
                <th style={cell(true)}>Aanvang</th>
                <th style={cell(true)}>Verzamelen</th>
                <th style={cell(true)}>Tegenstander</th>
                <th style={cell(true)}>Thuis/uit</th>
                <th style={cell(true)}>Locatie</th>
              </tr>
            </thead>
            <tbody>
              {monthMatches.map((match) => {
                const date = new Date(match.match_date);
                const gathering = match.gathering_time
                  ? new Date(match.gathering_time)
                  : calculateGatheringTime(match.match_date, defaultGatheringMinutes, match.travel_time_minutes);
                return (
                  <tr key={match.id}>
                    <td style={cell()}>
                      {date.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" })}
                    </td>
                    <td style={{ ...cell(), fontVariantNumeric: "tabular-nums" }}>{formatTime(date)}</td>
                    <td style={{ ...cell(), fontVariantNumeric: "tabular-nums" }}>{formatTime(gathering)}</td>
                    <td style={{ ...cell(), fontWeight: 600 }}>{match.opponent}</td>
                    <td style={cell()}>{HOME_AWAY_LABELS[match.home_away]}</td>
                    <td style={cell()}>{match.location ?? ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      <p style={{ marginTop: 40, fontSize: 11, color: "#9CA3AF", textAlign: "center" }}>
        Gemaakt met MyTeamPlanner · myteamplanner.nl · gratis voor je team
      </p>
    </div>
  );
}

function cell(header = false): React.CSSProperties {
  return {
    padding: "8px 8px",
    borderBottom: header ? "1px solid #D1D5DB" : "1px solid #F3F4F6",
    fontWeight: header ? 600 : undefined,
    verticalAlign: "top",
  };
}

function groupByMonth(matches: Match[]): [string, Match[]][] {
  const groups = new Map<string, Match[]>();
  for (const match of matches) {
    const key = new Date(match.match_date).toLocaleDateString("nl-NL", { month: "long", year: "numeric" });
    groups.set(key, [...(groups.get(key) ?? []), match]);
  }
  return [...groups.entries()];
}
