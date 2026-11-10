import { describe, expect, it } from "vitest";
import {
  buildTeamCalendar,
  escapeText,
  foldLine,
  googleCalendarSubscribeUrl,
  matchDurationMinutes,
  webcalUrl,
} from "../team-calendar";
import type { PublicMatch, PublicTeamView } from "@/types/public-team";

function match(overrides: Partial<PublicMatch>): PublicMatch {
  return {
    id: "m1",
    opponent: "VV Oost",
    // 10:00 in Amsterdam (CET, UTC+1)
    match_date: "2026-11-14T09:00:00Z",
    home_away: "away",
    location: "Sportpark Oost, Veld 2",
    gathering_time: null,
    travel_time_minutes: 20,
    status: "upcoming",
    score_home: null,
    score_away: null,
    lineup: null,
    ...overrides,
  };
}

const view: PublicTeamView = {
  found: true,
  team_name: "JO10-1",
  club_name: "VV West",
  team_type: "jo10",
  default_gathering_minutes: 30,
  matches: [match({})],
};

const options = { followUrl: "https://www.myteamplanner.nl/volg/abc", now: new Date("2026-11-10T12:00:00Z") };

function unfold(ics: string): string {
  return ics.replace(/\r\n /g, "");
}

describe("buildTeamCalendar", () => {
  const ics = unfold(buildTeamCalendar(view, options));

  it("is a valid calendar with CRLF line endings", () => {
    expect(ics.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(ics).toContain("X-WR-CALNAME:JO10-1 · wedstrijden");
  });

  it("starts at the gathering time and ends after the match", () => {
    // 09:00Z kickoff minus 30 + 20 minutes
    expect(ics).toContain("DTSTART:20261114T081000Z");
    // 2x25 minutes plus 15
    expect(ics).toContain("DTEND:20261114T100500Z");
  });

  it("shows local times and the follow link, escaped", () => {
    expect(ics).toContain("DESCRIPTION:Verzamelen 09:10 · aftrap 10:00\\nProgramma en opstelling: https://www.myteamplanner.nl/volg/abc");
    expect(ics).toContain("LOCATION:Sportpark Oost\\, Veld 2");
    expect(ics).toContain("SUMMARY:JO10-1 – VV Oost (uit)");
    expect(ics).toContain("UID:m1@myteamplanner.nl");
  });

  it("uses a stored gathering time when there is one", () => {
    const out = unfold(buildTeamCalendar({ ...view, matches: [match({ gathering_time: "2026-11-14T08:30:00Z" })] }, options));
    expect(out).toContain("DTSTART:20261114T083000Z");
  });

  it("adds the score to played matches and leaves out cancelled ones", () => {
    const out = unfold(
      buildTeamCalendar(
        {
          ...view,
          matches: [
            match({ id: "played", status: "completed", score_home: 3, score_away: 1, home_away: "home" }),
            match({ id: "off", status: "cancelled" }),
          ],
        },
        options,
      ),
    );
    expect(out).toContain("SUMMARY:JO10-1 – VV Oost (thuis) 3-1");
    expect(out).not.toContain("UID:off@");
  });

  it("works without matches", () => {
    const out = buildTeamCalendar({ ...view, matches: [] }, options);
    expect(out).not.toContain("BEGIN:VEVENT");
  });
});

describe("helpers", () => {
  it("escapes RFC 5545 text", () => {
    expect(escapeText("a,b;c\\d\ne")).toBe(String.raw`a\,b\;c\\d\ne`);
  });

  it("folds long lines at 75 octets without splitting characters", () => {
    const line = `SUMMARY:${"é".repeat(60)}`;
    const folded = foldLine(line);
    for (const part of folded.split("\r\n")) {
      expect(new TextEncoder().encode(part).length).toBeLessThanOrEqual(75);
    }
    expect(folded.replace(/\r\n /g, "")).toBe(line);
  });

  it("derives match length from the team type", () => {
    expect(matchDurationMinutes("senioren")).toBe(105);
    expect(matchDurationMinutes("jo12_jo11")).toBe(75);
    expect(matchDurationMinutes(undefined)).toBe(105);
  });

  it("builds subscribe URLs", () => {
    const url = "https://www.myteamplanner.nl/volg/abc/agenda.ics";
    expect(webcalUrl(url)).toBe("webcal://www.myteamplanner.nl/volg/abc/agenda.ics");
    expect(googleCalendarSubscribeUrl(url)).toBe(
      "https://calendar.google.com/calendar/render?cid=webcal%3A%2F%2Fwww.myteamplanner.nl%2Fvolg%2Fabc%2Fagenda.ics",
    );
  });
});
