import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface GeocodingResult {
  lat: string;
  lon: string;
}

interface OsrmResponse {
  routes: { duration: number }[];
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const query = `${address}, Nederland`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

  const response = await fetch(url, {
    headers: { "User-Agent": "TeamPlanner/1.0" },
  });

  if (!response.ok) return null;

  const results: GeocodingResult[] = await response.json();
  if (results.length === 0) return null;

  return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
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

    const routeResponse = await fetch(routeUrl);
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
