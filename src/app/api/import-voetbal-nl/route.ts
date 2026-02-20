import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  discoverClubAbbrev,
  getTeams,
  getMatchesFromApi,
  getLocationsFromIcal,
  enrichMatchesWithLocations,
} from "@/lib/voetbal-nl-parser";

const RATE_LIMIT_MS = 30 * 1000; // 30 seconds between requests
const lastRequestMap = new Map<string, number>();

export async function POST(request: Request) {
  // Verify authentication
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  // Rate limiting
  const lastRequest = lastRequestMap.get(user.id);
  if (lastRequest && Date.now() - lastRequest < RATE_LIMIT_MS) {
    const remaining = Math.ceil(
      (RATE_LIMIT_MS - (Date.now() - lastRequest)) / 1000
    );
    return NextResponse.json(
      { error: `Wacht ${remaining} seconden voordat je opnieuw zoekt.` },
      { status: 429 }
    );
  }

  let body: {
    action: "discover" | "import";
    teamUrl?: string;
    clubAbbrev?: string;
    teamName?: string;
    teamId?: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Ongeldige request body." },
      { status: 400 }
    );
  }

  lastRequestMap.set(user.id, Date.now());

  // --- Action: discover ---
  if (body.action === "discover") {
    if (!body.teamUrl) {
      return NextResponse.json(
        { error: "Team-URL is verplicht." },
        { status: 400 }
      );
    }

    try {
      new URL(body.teamUrl);
    } catch {
      return NextResponse.json(
        { error: "Ongeldige URL." },
        { status: 400 }
      );
    }

    try {
      const clubAbbrev = await discoverClubAbbrev(body.teamUrl);

      if (!clubAbbrev) {
        return NextResponse.json(
          {
            error:
              "Kon geen VoetbalAssist-data vinden voor deze website. " +
              "Controleer of dit een clubwebsite is die VoetbalAssist gebruikt.",
          },
          { status: 404 }
        );
      }

      const teams = await getTeams(clubAbbrev);

      return NextResponse.json({
        clubAbbrev,
        teams: teams
          .filter((t) => !t.disabled)
          .map((t) => ({ name: t.name, id: t.value })),
      });
    } catch (err) {
      console.error("Discovery error:", err);
      return NextResponse.json(
        { error: "Er is een fout opgetreden bij het zoeken." },
        { status: 500 }
      );
    }
  }

  // --- Action: import ---
  if (body.action === "import") {
    if (!body.clubAbbrev || !body.teamName) {
      return NextResponse.json(
        { error: "Club en team zijn verplicht." },
        { status: 400 }
      );
    }

    try {
      const { matches, results } = await getMatchesFromApi(
        body.clubAbbrev,
        body.teamName
      );

      // Try to get location data from iCal (optional, non-blocking)
      let enrichedMatches = matches;
      if (body.teamId) {
        const clubDomain =
          body.teamUrl
            ? new URL(body.teamUrl).hostname
            : null;

        if (clubDomain) {
          const locations = await getLocationsFromIcal(
            clubDomain,
            body.teamId
          );
          enrichedMatches = enrichMatchesWithLocations(matches, locations);
        }
      }

      return NextResponse.json({
        data: {
          teamName: body.teamName,
          matches: enrichedMatches,
          results,
          players: [], // Players can't be fetched from API (Cloudflare-protected)
        },
      });
    } catch (err) {
      console.error("Import error:", err);
      return NextResponse.json(
        { error: "Er is een fout opgetreden bij het ophalen van wedstrijden." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: "Ongeldige actie." },
    { status: 400 }
  );
}
