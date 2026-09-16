import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { upsertMatches } from "@/lib/match-sync";
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
    const upsertResult = await upsertMatches(supabase, teamId, matches);
    results.matchesCreated = upsertResult.matchesCreated;
    results.matchesUpdated = upsertResult.matchesUpdated;
    results.errors.push(...upsertResult.errors);
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
