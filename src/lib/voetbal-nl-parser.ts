// --- Types ---

export interface ParsedMatch {
  date: string;
  opponent: string;
  homeAway: "home" | "away";
  location: string | null;
}

export interface ParsedResult {
  date: string;
  opponent: string;
  scoreHome: number;
  scoreAway: number;
}

export interface ParsedPlayer {
  name: string;
  position: string | null;
}

export interface ParsedTeamData {
  teamName: string | null;
  matches: ParsedMatch[];
  results: ParsedResult[];
  players: ParsedPlayer[];
}

export interface VoetbalAssistTeam {
  name: string;
  value: number;
  disabled: boolean;
}

// --- VoetbalAssist API client ---

const VA_API_BASE = "https://site-api.voetbalassi.st";

// Common Dutch amateur football club prefixes
const CLUB_PREFIXES = [
  "rksv",
  "rkavv",
  "ksv",
  "avv",
  "cvv",
  "usv",
  "rkvv",
  "hvv",
  "svv",
  "vv",
  "sv",
  "sc",
  "fc",
  "rk",
];

/**
 * Try to discover the VoetbalAssist API abbreviation from a club website URL.
 * Tests PascalCase variations of the domain name against the teams API.
 */
export async function discoverClubAbbrev(
  clubUrl: string
): Promise<string | null> {
  const url = new URL(clubUrl);
  const domain = url.hostname.replace(/^www\./, "").split(".")[0];

  // Generate candidates: with and without club prefix removal
  const candidates = new Set<string>();

  // Try full domain in PascalCase
  addPascalCaseCandidates(domain, candidates);

  // Try with club prefix removed
  for (const prefix of CLUB_PREFIXES) {
    if (domain.startsWith(prefix) && domain.length > prefix.length) {
      const stripped = domain.slice(prefix.length);
      addPascalCaseCandidates(stripped, candidates);
    }
  }

  // Test each candidate against the API in parallel (batches of 6)
  const candidateArray = Array.from(candidates);

  for (let i = 0; i < candidateArray.length; i += 6) {
    const batch = candidateArray.slice(i, i + 6);
    const results = await Promise.allSettled(
      batch.map(async (abbrev) => {
        const res = await fetch(
          `${VA_API_BASE}/${abbrev}/front/skingridbreakpoint/getteams?toonAlleTeamsOptie=false`,
          { signal: AbortSignal.timeout(5000) }
        );
        if (res.ok) {
          const teams = await res.json();
          if (Array.isArray(teams) && teams.length > 0) {
            return abbrev;
          }
        }
        return null;
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        return result.value;
      }
    }
  }

  return null;
}

/**
 * Get all teams for a club from the VoetbalAssist API.
 */
export async function getTeams(
  clubAbbrev: string
): Promise<VoetbalAssistTeam[]> {
  const res = await fetch(
    `${VA_API_BASE}/${clubAbbrev}/front/skingridbreakpoint/getteams?toonAlleTeamsOptie=false`
  );

  if (!res.ok) {
    throw new Error(`Failed to get teams: ${res.status}`);
  }

  return res.json();
}

/**
 * Get matches for a specific team from the VoetbalAssist API.
 * Returns upcoming matches (programma).
 */
export async function getMatchesFromApi(
  clubAbbrev: string,
  teamName: string
): Promise<{ matches: ParsedMatch[]; results: ParsedResult[] }> {
  const now = new Date();
  const seasonStart =
    now.getMonth() >= 6
      ? new Date(now.getFullYear(), 6, 1)
      : new Date(now.getFullYear() - 1, 6, 1);
  const seasonEnd = new Date(seasonStart.getFullYear() + 1, 6, 1);

  // Fetch both programma (upcoming) and uitslagen (results) in parallel
  const [programmaRes, uitslagenRes] = await Promise.all([
    fetch(
      `${VA_API_BASE}/${clubAbbrev}/front/programmaenuitslagen/PostWedstrijden`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datumVan: now.toISOString().split("T")[0] + "T00:00:00",
          datumTot: seasonEnd.toISOString().split("T")[0] + "T00:00:00",
          datumBeginSeizoen:
            seasonStart.toISOString().split("T")[0] + "T00:00:00",
          datumEindeSeizoen:
            seasonEnd.toISOString().split("T")[0] + "T00:00:00",
          vandaag: now.toISOString(),
          programmaEnUitslagenType: 1,
          klantAfkorting: clubAbbrev,
          clubWedstrijdenStandaardSorterenOp: "team",
          lang: "nl",
        }),
      }
    ),
    fetch(
      `${VA_API_BASE}/${clubAbbrev}/front/programmaenuitslagen/PostWedstrijden`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datumVan: seasonStart.toISOString().split("T")[0] + "T00:00:00",
          datumTot: now.toISOString().split("T")[0] + "T00:00:00",
          datumBeginSeizoen:
            seasonStart.toISOString().split("T")[0] + "T00:00:00",
          datumEindeSeizoen:
            seasonEnd.toISOString().split("T")[0] + "T00:00:00",
          vandaag: now.toISOString(),
          programmaEnUitslagenType: 2,
          klantAfkorting: clubAbbrev,
          clubWedstrijdenStandaardSorterenOp: "team",
          lang: "nl",
        }),
      }
    ),
  ]);

  if (!programmaRes.ok || !uitslagenRes.ok) {
    throw new Error("Failed to fetch matches from VoetbalAssist API");
  }

  const [allProgramma, allUitslagen] = await Promise.all([
    programmaRes.json(),
    uitslagenRes.json(),
  ]);

  const teamNameLower = teamName.toLowerCase();

  // Filter and map upcoming matches
  const matches: ParsedMatch[] = filterTeamMatches(
    allProgramma,
    teamNameLower
  ).map((m) => {
    const isHome =
      m.thuisClubEnTeamNaamFriendly?.toLowerCase() === teamNameLower;
    const opponent = isHome
      ? m.uitClubEnTeamNaamFriendly
      : m.thuisClubEnTeamNaamFriendly;
    const date = formatApiDate(m.datum);

    return {
      date,
      opponent,
      homeAway: isHome ? ("home" as const) : ("away" as const),
      location: null,
    };
  });

  // Filter and map results
  const results: ParsedResult[] = filterTeamMatches(
    allUitslagen,
    teamNameLower
  )
    .filter((m) => m.uitslag && m.uitslag !== "")
    .map((m) => {
      const isHome =
        m.thuisClubEnTeamNaamFriendly?.toLowerCase() === teamNameLower;
      const opponent = isHome
        ? m.uitClubEnTeamNaamFriendly
        : m.thuisClubEnTeamNaamFriendly;
      const date = formatApiDate(m.datum);
      const score = parseScoreHtml(m.uitslag);

      return {
        date,
        opponent,
        scoreHome: isHome ? score.home : score.away,
        scoreAway: isHome ? score.away : score.home,
      };
    });

  return { matches, results };
}

/**
 * Fetch location data from the iCal feed.
 * Returns a map of match summary → location.
 */
export async function getLocationsFromIcal(
  clubDomain: string,
  teamId: number
): Promise<Map<string, string>> {
  const locations = new Map<string, string>();

  try {
    const res = await fetch(
      `https://${clubDomain}/Modules/UitslagenEnStanden/Front/ICal.ashx?id=${teamId}`,
      { signal: AbortSignal.timeout(5000) }
    );

    if (!res.ok) return locations;

    const ical = await res.text();
    const events = ical.split("BEGIN:VEVENT");

    for (const event of events.slice(1)) {
      const summary = event.match(/SUMMARY:(.+)/)?.[1]?.trim();
      const location = event
        .match(/LOCATION:(.+)/)?.[1]
        ?.trim()
        .replace(/\\,/g, ",");
      const dtstart = event.match(/DTSTART[^:]*:(\d{8}T\d{6})/)?.[1];

      if (summary && location && dtstart) {
        // Key: ISO date prefix (YYYYMMDD) to match with API dates
        const dateKey = dtstart.slice(0, 8);
        locations.set(dateKey, location);
      }
    }
  } catch {
    // iCal fetch failed — locations will be empty, that's OK
  }

  return locations;
}

/**
 * Enrich matches with location data from iCal.
 */
export function enrichMatchesWithLocations(
  matches: ParsedMatch[],
  locations: Map<string, string>
): ParsedMatch[] {
  return matches.map((match) => {
    // Convert match date "DD-MM-YYYY HH:MM" to "YYYYMMDD" for iCal lookup
    const dateKey = matchDateToIcalKey(match.date);
    const location = dateKey ? (locations.get(dateKey) ?? null) : null;

    return { ...match, location: location ?? match.location };
  });
}

// --- Helpers ---

interface VoetbalAssistMatch {
  datum: string;
  thuisClubEnTeamNaamFriendly: string;
  uitClubEnTeamNaamFriendly: string;
  uitslag: string;
  isThuiswedstrijd: boolean;
  statusAfgelast: boolean;
}

function filterTeamMatches(
  allMatches: VoetbalAssistMatch[],
  teamNameLower: string
): VoetbalAssistMatch[] {
  return allMatches.filter(
    (m) =>
      !m.statusAfgelast &&
      (m.thuisClubEnTeamNaamFriendly?.toLowerCase() === teamNameLower ||
        m.uitClubEnTeamNaamFriendly?.toLowerCase() === teamNameLower)
  );
}

/**
 * Format API date "2026-02-28T11:30:00" to "28-02-2026 11:30".
 */
function formatApiDate(apiDate: string): string {
  const d = new Date(apiDate);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
}

/**
 * Parse score from HTML like "<span class=''>3 - 5</span>" to { home, away }.
 */
function parseScoreHtml(html: string): { home: number; away: number } {
  const text = html.replace(/<[^>]+>/g, "").trim();
  const match = /(\d+)\s*-\s*(\d+)/.exec(text);
  if (!match) return { home: 0, away: 0 };
  return { home: parseInt(match[1], 10), away: parseInt(match[2], 10) };
}

/**
 * Convert "DD-MM-YYYY HH:MM" to "YYYYMMDD" for iCal key lookup.
 */
function matchDateToIcalKey(dateStr: string): string | null {
  const match = /(\d{2})-(\d{2})-(\d{4})/.exec(dateStr);
  if (!match) return null;
  return `${match[3]}${match[2]}${match[1]}`;
}

/**
 * Generate PascalCase candidate abbreviations from a lowercase string.
 * Tries splitting at each position to create 2-word PascalCase.
 */
function addPascalCaseCandidates(
  str: string,
  candidates: Set<string>
): void {
  if (str.length < 2) return;

  // Single word: capitalize first letter
  candidates.add(str[0].toUpperCase() + str.slice(1));

  // Two words: split at each position
  for (let i = 1; i < str.length; i++) {
    const word1 = str.slice(0, i);
    const word2 = str.slice(i);
    candidates.add(
      word1[0].toUpperCase() + word1.slice(1) +
      word2[0].toUpperCase() + word2.slice(1)
    );
  }
}
