import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getMatchesFromApi,
  getLocationsFromIcal,
  enrichMatchesWithLocations,
} from "@/lib/voetbal-nl-parser";
import { upsertMatches, applyResults } from "@/lib/match-sync";

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

  if (!teamId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(teamId)) {
    return NextResponse.json(
      { error: "Ongeldig Team ID." },
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

  // Get import source data
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select(
      "id, import_club_abbrev, import_team_name, import_team_id, import_team_url"
    )
    .eq("id", teamId)
    .single();

  if (teamError || !team) {
    return NextResponse.json(
      { error: "Team niet gevonden." },
      { status: 404 }
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
    resultsUpdated: 0,
    errors: [] as string[],
  };

  try {
    // Fetch matches and results from VoetbalAssist API
    const { matches: apiMatches, results: apiResults } =
      await getMatchesFromApi(team.import_club_abbrev, team.import_team_name);

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

    const upsertResult = await upsertMatches(supabase, teamId, enrichedMatches);
    results.matchesCreated = upsertResult.matchesCreated;
    results.matchesUpdated = upsertResult.matchesUpdated;
    results.errors.push(...upsertResult.errors);

    const resultsResult = await applyResults(supabase, teamId, apiResults);
    results.resultsUpdated = resultsResult.resultsUpdated;
    results.errors.push(...resultsResult.errors);
  } catch (err) {
    console.error("Refresh error:", err);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het ophalen van wedstrijden." },
      { status: 500 }
    );
  }

  return NextResponse.json({ results });
}
