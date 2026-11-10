import { describe, expect, it } from "vitest";
import { availabilityReminderText, joinNames } from "../availability-reminder";

describe("joinNames", () => {
  it("joins names the Dutch way", () => {
    expect(joinNames([])).toBe("");
    expect(joinNames(["Tom"])).toBe("Tom");
    expect(joinNames(["Tom", "Sem"])).toBe("Tom en Sem");
    expect(joinNames(["Tom", "Sem", "Daan"])).toBe("Tom, Sem en Daan");
  });
});

describe("availabilityReminderText", () => {
  const text = availabilityReminderText(["Tom", "Sem"], {
    opponent: "VV Oost",
    // 10:00 in Amsterdam
    matchDate: "2026-11-14T09:00:00Z",
    homeAway: "away",
    matchUrl: "https://www.myteamplanner.nl/matches/m1",
  });

  it("names the match in local time", () => {
    expect(text.split("\n")[0]).toBe("Wie kan er zaterdag 14 november mee tegen VV Oost? (10:00, uit)");
  });

  it("lists who has not answered and links to the match", () => {
    expect(text).toContain("Nog geen reactie van Tom en Sem.");
    expect(text).toContain("https://www.myteamplanner.nl/matches/m1");
  });
});
