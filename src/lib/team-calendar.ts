import { TEAM_TYPE_CONFIG } from "@/lib/constants";
import { calculateGatheringTime } from "@/lib/utils";
import type { PublicMatch, PublicTeamView } from "@/types/public-team";

/**
 * iCalendar feed for the follow link (`/volg/<token>/agenda.ics`). Parents
 * subscribe once; their calendar app re-fetches the feed, so changed or
 * cancelled matches update by themselves. Holds no player names.
 */

const TIME_ZONE = "Europe/Amsterdam";
/** Half-time break plus a margin for getting changed afterwards. */
const EXTRA_MINUTES = 15;

export function calendarPath(token: string): string {
  return `/volg/${token}/agenda.ics`;
}

/** webcal:// makes iOS and macOS open the subscribe dialog. */
export function webcalUrl(httpsUrl: string): string {
  return httpsUrl.replace(/^https?:\/\//, "webcal://");
}

export function googleCalendarSubscribeUrl(httpsUrl: string): string {
  return `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcalUrl(httpsUrl))}`;
}

function formatUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function localTime(date: Date): string {
  return date.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit", timeZone: TIME_ZONE });
}

/** RFC 5545 text escaping. */
export function escapeText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Folds a content line at 75 octets, as RFC 5545 requires. */
export function foldLine(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;

  const parts: string[] = [];
  let current = "";
  let currentBytes = 0;
  for (const char of line) {
    const size = new TextEncoder().encode(char).length;
    const limit = parts.length === 0 ? 75 : 74; // continuation lines start with a space
    if (currentBytes + size > limit) {
      parts.push(current);
      current = "";
      currentBytes = 0;
    }
    current += char;
    currentBytes += size;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

export function matchDurationMinutes(teamType: string | undefined): number {
  const config = teamType ? TEAM_TYPE_CONFIG[teamType] : undefined;
  const playing = config ? config.halves * config.halfMinutes : 90;
  return playing + EXTRA_MINUTES;
}

function matchEvent(
  match: PublicMatch,
  view: PublicTeamView,
  followUrl: string,
  stamp: string,
): string[] {
  const kickoff = new Date(match.match_date);
  const gathering = match.gathering_time
    ? new Date(match.gathering_time)
    : calculateGatheringTime(match.match_date, view.default_gathering_minutes ?? 60, match.travel_time_minutes);
  const start = gathering < kickoff ? gathering : kickoff;
  const end = new Date(kickoff.getTime() + matchDurationMinutes(view.team_type) * 60_000);

  const team = view.team_name ?? "Team";
  const side = match.home_away === "home" ? "thuis" : "uit";
  const score =
    match.status === "completed" && match.score_home !== null && match.score_away !== null
      ? ` ${match.score_home}-${match.score_away}`
      : "";
  const summary = `${team} – ${match.opponent} (${side})${score}`;
  const description = [
    `Verzamelen ${localTime(gathering)} · aftrap ${localTime(kickoff)}`,
    `Programma en opstelling: ${followUrl}`,
  ].join("\n");

  return [
    "BEGIN:VEVENT",
    `UID:${match.id}@myteamplanner.nl`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${formatUtc(start)}`,
    `DTEND:${formatUtc(end)}`,
    `SUMMARY:${escapeText(summary)}`,
    `DESCRIPTION:${escapeText(description)}`,
    ...(match.location ? [`LOCATION:${escapeText(match.location)}`] : []),
    `URL:${followUrl}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
  ];
}

export function buildTeamCalendar(
  view: PublicTeamView,
  options: { followUrl: string; now: Date },
): string {
  const stamp = formatUtc(options.now);
  const name = `${view.team_name ?? "Team"} · wedstrijden`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MyTeamPlanner//Volglink//NL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(name)}`,
    `X-WR-TIMEZONE:${TIME_ZONE}`,
    "REFRESH-INTERVAL;VALUE=DURATION:PT6H",
    "X-PUBLISHED-TTL:PT6H",
    ...(view.matches ?? [])
      .filter((m) => m.status !== "cancelled")
      .flatMap((m) => matchEvent(m, view, options.followUrl, stamp)),
    "END:VCALENDAR",
  ];
  return lines.map(foldLine).join("\r\n") + "\r\n";
}
