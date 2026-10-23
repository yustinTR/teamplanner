/**
 * Football seasons run from 1 August to 31 July. A season is identified by
 * the calendar year it starts in: season 2026 = 2026-08-01 … 2027-07-31.
 */

export const SEASON_START_MONTH = 7; // August (0-based)

export function seasonOf(date: Date): number {
  return date.getMonth() >= SEASON_START_MONTH
    ? date.getFullYear()
    : date.getFullYear() - 1;
}

export function currentSeason(now: Date = new Date()): number {
  return seasonOf(now);
}

/** ISO bounds for a `match_date` filter: start inclusive, end exclusive. */
export function seasonBounds(season: number): { start: string; end: string } {
  const start = new Date(season, SEASON_START_MONTH, 1);
  const end = new Date(season + 1, SEASON_START_MONTH, 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

export function isInSeason(dateString: string, season: number): boolean {
  return seasonOf(new Date(dateString)) === season;
}

/** "2026/27" */
export function seasonLabel(season: number): string {
  return `${season}/${String(season + 1).slice(-2)}`;
}

/**
 * Seasons to offer in a selector: every season that has a match, plus the
 * current one, newest first.
 */
export function availableSeasons(
  matchDates: string[],
  now: Date = new Date()
): number[] {
  const seasons = new Set<number>([currentSeason(now)]);
  for (const date of matchDates) seasons.add(seasonOf(new Date(date)));
  return [...seasons].sort((a, b) => b - a);
}
