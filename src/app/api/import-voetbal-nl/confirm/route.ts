import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ParsedMatch, ParsedPlayer } from "@/lib/voetbal-nl-parser";

interface ImportSource {
  clubAbbrev: string;
  teamName: string;
  teamId: number;
  teamUrl: string;
}

interface ConfirmBody {
  teamId: string;
  matches: ParsedMatch[];
  players: ParsedPlayer[];
  importSource?: ImportSource;
}

export async function POST(request: Request) {
  // Verify authentication
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Niet ingelogd." },
      { status: 401 }
    );
  }

  // Parse request body
  let body: ConfirmBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Ongeldige request body." },
      { status: 400 }
    );
  }

  const { teamId, matches, players, importSource } = body;

  if (!teamId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(teamId)) {
    return NextResponse.json(
      { error: "Ongeldig Team ID." },
      { status: 400 }
    );
  }

  if (matches && matches.length > 200) {
    return NextResponse.json(
      { error: "Maximaal 200 wedstrijden per import." },
      { status: 400 }
    );
  }

  if (players && players.length > 100) {
    return NextResponse.json(
      { error: "Maximaal 100 spelers per import." },
      { status: 400 }
    );
  }

  // Verify user is coach or admin of this team
  const { data: isAdmin } = await supabase.rpc("is_team_admin", { check_team_id: teamId });

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Geen toegang tot dit team." },
      { status: 403 }
    );
  }

  const results = {
    matchesCreated: 0,
    matchesUpdated: 0,
    playersCreated: 0,
    errors: [] as string[],
  };

  // Import matches with deduplication
  if (matches?.length) {
    // Fetch existing matches for this team to check for duplicates
    const { data: existingMatches } = await supabase
      .from("matches")
      .select("id, opponent, match_date")
      .eq("team_id", teamId);

    for (const match of matches) {
      try {
        const matchDate = parseDate(match.date);
        if (!matchDate) {
          results.errors.push(
            `Ongeldige datum voor wedstrijd tegen ${match.opponent}`
          );
          continue;
        }

        // Check for existing match: same opponent (case-insensitive) + same day
        const matchDay = new Date(matchDate);
        const existing = existingMatches?.find((em) => {
          const existingDay = new Date(em.match_date);
          return (
            em.opponent.toLowerCase() === match.opponent.toLowerCase() &&
            existingDay.getFullYear() === matchDay.getFullYear() &&
            existingDay.getMonth() === matchDay.getMonth() &&
            existingDay.getDate() === matchDay.getDate()
          );
        });

        if (existing) {
          // Update existing match
          const { error } = await supabase
            .from("matches")
            .update({
              match_date: matchDate,
              home_away: match.homeAway,
              location: match.location,
            })
            .eq("id", existing.id);

          if (error) {
            results.errors.push(
              `Fout bij updaten wedstrijd tegen ${match.opponent}: ${error.message}`
            );
          } else {
            results.matchesUpdated++;
          }
        } else {
          // Insert new match
          const { error } = await supabase.from("matches").insert({
            team_id: teamId,
            opponent: match.opponent,
            match_date: matchDate,
            home_away: match.homeAway,
            location: match.location,
            status: "upcoming",
          });

          if (error) {
            results.errors.push(
              `Fout bij aanmaken wedstrijd tegen ${match.opponent}: ${error.message}`
            );
          } else {
            results.matchesCreated++;
          }
        }
      } catch {
        results.errors.push(
          `Onverwachte fout bij wedstrijd tegen ${match.opponent}`
        );
      }
    }
  }

  // Import players
  if (players?.length) {
    for (const player of players) {
      try {
        const trimmedName = (player.name ?? "").trim();
        if (!trimmedName || trimmedName.length > 200) {
          results.errors.push(`Ongeldige spelernaam: "${player.name}"`);
          continue;
        }

        const { error } = await supabase.from("players").insert({
          team_id: teamId,
          name: trimmedName,
          primary_position: player.position,
        });

        if (error) {
          results.errors.push(
            `Fout bij aanmaken speler ${player.name}: ${error.message}`
          );
        } else {
          results.playersCreated++;
        }
      } catch {
        results.errors.push(
          `Onverwachte fout bij speler ${player.name}`
        );
      }
    }
  }

  // Save import source to team if provided
  if (importSource) {
    const { error: importSourceError } = await supabase
      .from("teams")
      .update({
        import_club_abbrev: importSource.clubAbbrev,
        import_team_name: importSource.teamName,
        import_team_id: importSource.teamId,
        import_team_url: importSource.teamUrl,
      })
      .eq("id", teamId);
    if (importSourceError) {
      results.errors.push("Kon import-bron niet opslaan bij team.");
    }
  }

  return NextResponse.json({ results });
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
