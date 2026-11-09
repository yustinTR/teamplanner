import type { PublicMatch } from "@/types/public-team";

interface TeamWidgetProps {
  teamName: string;
  clubName?: string | null;
  matches: PublicMatch[];
  /** ISO timestamp used to split upcoming from played (server time). */
  now: string;
  /** Link target of the footer credit. */
  homeUrl?: string;
}

const MAX_ROWS = 3;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short", timeZone: "Europe/Amsterdam" });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Amsterdam" });
}

/**
 * Compact programme and results for a club website (iframe). Shows no
 * lineups or player names: a club site is public, the follow link is for
 * parents.
 */
export function TeamWidget({ teamName, clubName, matches, now, homeUrl = "https://www.myteamplanner.nl/maak" }: TeamWidgetProps) {
  const nowMs = new Date(now).getTime();
  const upcoming = matches
    .filter((m) => m.status === "upcoming" && new Date(m.match_date).getTime() >= nowMs - 3 * 3600 * 1000)
    .sort((a, b) => a.match_date.localeCompare(b.match_date))
    .slice(0, MAX_ROWS);
  const played = matches
    .filter((m) => m.status === "completed" && m.score_home !== null && m.score_away !== null)
    .sort((a, b) => b.match_date.localeCompare(a.match_date))
    .slice(0, MAX_ROWS);

  const home = (m: PublicMatch) => (m.home_away === "home" ? teamName : m.opponent);
  const away = (m: PublicMatch) => (m.home_away === "home" ? m.opponent : teamName);

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white font-sans text-neutral-900">
      <div className="bg-primary-700 px-4 py-3 text-white">
        <p className="text-base font-bold leading-tight">{teamName}</p>
        {clubName && <p className="text-xs text-white/80">{clubName}</p>}
      </div>

      <section className="px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Programma</h2>
        {upcoming.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500">Geen aankomende wedstrijden.</p>
        ) : (
          <ul className="mt-2 divide-y divide-neutral-100">
            {upcoming.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="min-w-0 truncate">
                  {home(m)} – {away(m)}
                </span>
                <span className="shrink-0 tabular-nums text-neutral-500">
                  {formatDate(m.match_date)} {formatTime(m.match_date)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {played.length > 0 && (
        <section className="border-t border-neutral-100 px-4 py-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Uitslagen</h2>
          <ul className="mt-2 divide-y divide-neutral-100">
            {played.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="min-w-0 truncate">
                  {home(m)} – {away(m)}
                </span>
                <span className="shrink-0 font-semibold tabular-nums">
                  {m.score_home} – {m.score_away}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <a
        href={homeUrl}
        target="_blank"
        rel="noopener"
        className="block border-t border-neutral-100 px-4 py-2 text-center text-xs text-neutral-500 hover:text-primary-700"
      >
        Bijgehouden met <span className="font-semibold text-primary-700">MyTeamPlanner</span>
      </a>
    </div>
  );
}
