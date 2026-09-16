import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { ParsedMatch, ParsedResult } from "@/lib/voetbal-nl-parser";

type Client = SupabaseClient<Database>;

// Type alias (not interface) so it stays assignable to the Json column type
export type MatchChange = {
  type: "created" | "updated" | "result";
  opponent: string;
  matchDate: string;
};

export interface UpsertMatchesResult {
  matchesCreated: number;
  matchesUpdated: number;
  changes: MatchChange[];
  errors: string[];
}

export interface ApplyResultsResult {
  resultsUpdated: number;
  changes: MatchChange[];
  errors: string[];
}

/**
 * Parse date format "dd-mm-yyyy" or "dd-mm-yyyy HH:mm" to ISO string.
 */
export function parseDate(dateStr: string): string | null {
  const match =
    /(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})(?:\s+(\d{1,2}):(\d{2}))?/.exec(
      dateStr
    );
  if (!match) return null;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  let year = parseInt(match[3], 10);
  const hours = match[4] ? parseInt(match[4], 10) : 14;
  const minutes = match[5] ? parseInt(match[5], 10) : 0;

  // Handle 2-digit year
  if (year < 100) {
    year += year < 50 ? 2000 : 1900;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const date = new Date(year, month - 1, day, hours, minutes, 0);
  // Detect invalid dates like Feb 31 that silently roll over to March
  if (date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date.toISOString();
}

interface ExistingMatch {
  id: string;
  opponent: string;
  match_date: string;
  home_away: Database["public"]["Enums"]["home_away"];
  location: string | null;
  score_home: number | null;
  score_away: number | null;
}

function findByOpponentAndDay(
  existingMatches: ExistingMatch[],
  opponent: string,
  matchDate: string
): ExistingMatch | undefined {
  const matchDay = new Date(matchDate);
  return existingMatches.find((em) => {
    const existingDay = new Date(em.match_date);
    return (
      em.opponent.toLowerCase() === opponent.toLowerCase() &&
      existingDay.getFullYear() === matchDay.getFullYear() &&
      existingDay.getMonth() === matchDay.getMonth() &&
      existingDay.getDate() === matchDay.getDate()
    );
  });
}

async function fetchExistingMatches(
  supabase: Client,
  teamId: string
): Promise<ExistingMatch[]> {
  const { data } = await supabase
    .from("matches")
    .select("id, opponent, match_date, home_away, location, score_home, score_away")
    .eq("team_id", teamId);
  return data ?? [];
}

/**
 * Insert new matches and update changed ones (time, home/away, location).
 * Deduplicates on opponent (case-insensitive) + calendar day. Unchanged
 * matches are left untouched so counts reflect real changes.
 */
export async function upsertMatches(
  supabase: Client,
  teamId: string,
  matches: ParsedMatch[]
): Promise<UpsertMatchesResult> {
  const result: UpsertMatchesResult = {
    matchesCreated: 0,
    matchesUpdated: 0,
    changes: [],
    errors: [],
  };

  if (matches.length === 0) return result;

  const existingMatches = await fetchExistingMatches(supabase, teamId);

  for (const match of matches) {
    try {
      const matchDate = parseDate(match.date);
      if (!matchDate) {
        result.errors.push(
          `Ongeldige datum voor wedstrijd tegen ${match.opponent}`
        );
        continue;
      }

      const existing = findByOpponentAndDay(
        existingMatches,
        match.opponent,
        matchDate
      );

      if (existing) {
        const timeChanged =
          new Date(existing.match_date).getTime() !==
          new Date(matchDate).getTime();
        const homeAwayChanged = existing.home_away !== match.homeAway;
        // A null parsed location means the iCal lookup failed — never wipe
        // an existing location with it
        const locationChanged =
          match.location != null && existing.location !== match.location;

        if (!timeChanged && !homeAwayChanged && !locationChanged) {
          continue;
        }

        const { error } = await supabase
          .from("matches")
          .update({
            match_date: matchDate,
            home_away: match.homeAway,
            location: match.location ?? existing.location,
          })
          .eq("id", existing.id);

        if (error) {
          result.errors.push(
            `Fout bij updaten wedstrijd tegen ${match.opponent}: ${error.message}`
          );
        } else {
          result.matchesUpdated++;
          result.changes.push({
            type: "updated",
            opponent: match.opponent,
            matchDate,
          });
        }
      } else {
        const { error } = await supabase.from("matches").insert({
          team_id: teamId,
          opponent: match.opponent,
          match_date: matchDate,
          home_away: match.homeAway,
          location: match.location,
          status: "upcoming",
        });

        if (error) {
          result.errors.push(
            `Fout bij aanmaken wedstrijd tegen ${match.opponent}: ${error.message}`
          );
        } else {
          result.matchesCreated++;
          result.changes.push({
            type: "created",
            opponent: match.opponent,
            matchDate,
          });
        }
      }
    } catch {
      result.errors.push(
        `Onverwachte fout bij wedstrijd tegen ${match.opponent}`
      );
    }
  }

  return result;
}

/**
 * Apply results to existing matches: set scores and mark completed.
 * ParsedResult scores are team-relative (scoreHome = own goals); the
 * database stores scoreboard order (score_home = home team goals).
 * Matches that already have a score are never overwritten, so manually
 * entered scores stay intact.
 */
export async function applyResults(
  supabase: Client,
  teamId: string,
  results: ParsedResult[]
): Promise<ApplyResultsResult> {
  const result: ApplyResultsResult = {
    resultsUpdated: 0,
    changes: [],
    errors: [],
  };

  if (results.length === 0) return result;

  const existingMatches = await fetchExistingMatches(supabase, teamId);

  for (const matchResult of results) {
    try {
      const matchDate = parseDate(matchResult.date);
      if (!matchDate) continue;

      const existing = findByOpponentAndDay(
        existingMatches,
        matchResult.opponent,
        matchDate
      );
      if (!existing || existing.score_home != null) continue;

      const isHome = existing.home_away === "home";
      const { error } = await supabase
        .from("matches")
        .update({
          score_home: isHome ? matchResult.scoreHome : matchResult.scoreAway,
          score_away: isHome ? matchResult.scoreAway : matchResult.scoreHome,
          status: "completed",
        })
        .eq("id", existing.id);

      if (error) {
        result.errors.push(
          `Fout bij verwerken uitslag tegen ${matchResult.opponent}: ${error.message}`
        );
      } else {
        result.resultsUpdated++;
        result.changes.push({
          type: "result",
          opponent: matchResult.opponent,
          matchDate,
        });
      }
    } catch {
      result.errors.push(
        `Onverwachte fout bij uitslag tegen ${matchResult.opponent}`
      );
    }
  }

  return result;
}
