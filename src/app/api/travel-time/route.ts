import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface GeocodingResult {
  lat: string;
  lon: string;
}

interface OsrmResponse {
  routes: { duration: number }[];
}

async function nominatimSearch(query: string): Promise<GeocodingResult[]> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  const response = await fetch(url, {
    headers: { "User-Agent": "TeamPlanner/1.0" },
    next: { revalidate: 86400 },
  });
  if (!response.ok) return [];
  return response.json();
}

// Voetbal.nl locations often have format "Sportpark X ClubName City"
// where the club name breaks Nominatim geocoding.
// This generates progressively simpler search queries as fallbacks.
//
// Example: "Sportpark Kerkpolder DVV Delft"
//  1. "Sportpark Kerkpolder DVV Delft"       (original)
//  2. "Sportpark Kerkpolder DVV, Delft"      (comma before last word = city hint)
//  3. "Kerkpolder DVV Delft"                 (without "Sportpark")
//  4. "Kerkpolder DVV, Delft"                (without "Sportpark" + city hint)
//  5. "DVV Delft"                            (last two words — often club + city)
function generateSearchVariants(address: string): string[] {
  const variants: string[] = [address];
  const words = address.split(/\s+/);

  if (words.length < 3) return variants;

  const lastWord = words[words.length - 1];
  const allButLast = words.slice(0, -1).join(" ");

  // Add comma before last word to help Nominatim identify the city
  variants.push(`${allButLast}, ${lastWord}`);

  // If starts with "Sportpark", try without it
  const lower = address.toLowerCase();
  if (lower.startsWith("sportpark ") && words.length >= 3) {
    const withoutSportpark = words.slice(1).join(" ");
    variants.push(withoutSportpark);

    // Without "Sportpark" + comma before city
    const withoutSpButLast = words.slice(1, -1).join(" ");
    variants.push(`${withoutSpButLast}, ${lastWord}`);
  }

  // Last two words (often "ClubName City" — clubs are in OSM)
  if (words.length >= 3) {
    variants.push(words.slice(-2).join(" "));
  }

  // Deduplicate while preserving order
  return [...new Set(variants)];
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const variants = generateSearchVariants(address);

  for (const variant of variants) {
    const query = `${variant}, Nederland`;
    const results = await nominatimSearch(query);
    if (results.length > 0) {
      return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
    }
  }

  return null;
}

function roundUpTo5(minutes: number): number {
  return Math.ceil(minutes / 5) * 5;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  let body: { from: string; to: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Ongeldige request body." },
      { status: 400 }
    );
  }

  if (!body.from || !body.to) {
    return NextResponse.json(
      { error: "Beide adressen zijn verplicht." },
      { status: 400 }
    );
  }

  const [fromCoords, toCoords] = await Promise.all([
    geocodeAddress(body.from),
    geocodeAddress(body.to),
  ]);

  if (!fromCoords) {
    return NextResponse.json(
      { error: `Adres niet gevonden: "${body.from}"` },
      { status: 422 }
    );
  }

  if (!toCoords) {
    return NextResponse.json(
      { error: `Adres niet gevonden: "${body.to}"` },
      { status: 422 }
    );
  }

  try {
    const routeUrl = `https://router.project-osrm.org/route/v1/driving/${fromCoords.lng},${fromCoords.lat};${toCoords.lng},${toCoords.lat}?overview=false`;

    const routeResponse = await fetch(routeUrl, {
      next: { revalidate: 3600 },
    });
    if (!routeResponse.ok) {
      return NextResponse.json(
        { error: "Kon de route niet berekenen." },
        { status: 502 }
      );
    }

    const routeData: OsrmResponse = await routeResponse.json();

    if (!routeData.routes || routeData.routes.length === 0) {
      return NextResponse.json(
        { error: "Geen route gevonden." },
        { status: 422 }
      );
    }

    const durationSeconds = routeData.routes[0].duration;
    const travelTimeMinutes = roundUpTo5(Math.ceil(durationSeconds / 60));

    return NextResponse.json({ travel_time_minutes: travelTimeMinutes });
  } catch {
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het berekenen van de reistijd." },
      { status: 500 }
    );
  }
}
