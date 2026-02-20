import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getMatchesFromApi,
  getLocationsFromIcal,
  enrichMatchesWithLocations,
} from "@/lib/voetbal-nl-parser";
import { parseDate } from "../confirm/route";

interface RefreshBody {
  teamId: string;
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
  let body: RefreshBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Ongeldige request body." },
      { status: 400 }
    );
  }

  const { teamId } = body;

  if (!teamId) {
    return NextResponse.json(
      { error: "Team ID is verplicht." },
      { status: 400 }
    );
  }

  // Verify user is coach and get import source
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select(
      "id, created_by, import_club_abbrev, import_team_name, import_team_id, import_team_url"
    )
    .eq("id", teamId)
    .single();

  if (teamError || !team || team.created_by !== user.id) {
    return NextResponse.json(
      { error: "Geen toegang tot dit team." },
      { status: 403 }
    );
  }

  if (!team.import_club_abbrev || !team.import_team_name) {
    return NextResponse.json(
      { error: "Geen import-bron ingesteld voor dit team." },
      { status: 400 }
    );
  }

  const results = {
    matchesCreated: 0,
    matchesUpdated: 0,
    errors: [] as string[],
  };

  try {
    // Fetch matches from VoetbalAssist API
    const { matches: apiMatches } = await getMatchesFromApi(
      team.import_club_abbrev,
      team.import_team_name
    );

    // Enrich with location data if possible
    let enrichedMatches = apiMatches;
    if (team.import_team_id && team.import_team_url) {
      try {
        const clubDomain = new URL(team.import_team_url).hostname;
        const locations = await getLocationsFromIcal(
          clubDomain,
          team.import_team_id
        );
        enrichedMatches = enrichMatchesWithLocations(apiMatches, locations);
      } catch {
        // Location enrichment failed — continue without locations
      }
    }

    // Fetch existing matches for deduplication
    const { data: existingMatches } = await supabase
      .from("matches")
      .select("id, opponent, match_date")
      .eq("team_id", teamId);

    // Upsert matches with dedup logic
    for (const match of enrichedMatches) {
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
  } catch (err) {
    console.error("Refresh error:", err);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het ophalen van wedstrijden." },
      { status: 500 }
    );
  }

  return NextResponse.json({ results });
}
