import { describe, it, expect } from "vitest";
import {
  availableSeasons,
  currentSeason,
  isInSeason,
  seasonBounds,
  seasonLabel,
  seasonOf,
} from "../season";

describe("season", () => {
  it("starts a season on 1 August", () => {
    expect(seasonOf(new Date(2026, 7, 1))).toBe(2026);
    expect(seasonOf(new Date(2026, 6, 31))).toBe(2025);
    expect(seasonOf(new Date(2027, 0, 15))).toBe(2026);
  });

  it("derives the current season from a reference date", () => {
    expect(currentSeason(new Date(2026, 9, 23))).toBe(2026);
    expect(currentSeason(new Date(2026, 2, 1))).toBe(2025);
  });

  it("gives a half-open August-to-August range", () => {
    const { start, end } = seasonBounds(2026);
    expect(new Date(start).getMonth()).toBe(7);
    expect(new Date(start).getFullYear()).toBe(2026);
    expect(new Date(end).getFullYear()).toBe(2027);
    expect(isInSeason(start, 2026)).toBe(true);
    expect(isInSeason(end, 2026)).toBe(false);
  });

  it("labels a season as 2026/27", () => {
    expect(seasonLabel(2026)).toBe("2026/27");
    expect(seasonLabel(2029)).toBe("2029/30");
  });

  it("lists seasons with matches plus the current one, newest first", () => {
    const dates = ["2025-09-06T12:00:00Z", "2025-03-01T12:00:00Z", "2026-09-05T12:00:00Z"];
    expect(availableSeasons(dates, new Date(2026, 9, 23))).toEqual([2026, 2025, 2024]);
    expect(availableSeasons([], new Date(2026, 9, 23))).toEqual([2026]);
  });
});
