import { describe, it, expect } from "vitest";
import { cn, formatMatchDate, formatDateShort, toDatetimeLocal, getInviteUrl, calculateGatheringTime, formatTime } from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("deduplicates conflicting Tailwind classes", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });
});

describe("formatMatchDate", () => {
  it("formats a date in Dutch locale with weekday, day, month, and time", () => {
    const result = formatMatchDate("2026-03-15T14:00:00Z");
    // Should contain Dutch weekday and month
    expect(result).toContain("maart");
    expect(result).toContain("15");
  });

  it("includes time component", () => {
    const result = formatMatchDate("2026-06-20T18:30:00Z");
    // Time should be present (exact format depends on locale/timezone)
    expect(result).toMatch(/\d{2}:\d{2}/);
  });
});

describe("formatDateShort", () => {
  it("formats a date with day, short month, and time", () => {
    const result = formatDateShort("2026-03-15T14:00:00Z");
    expect(result).toContain("15");
    // Short month in Dutch
    expect(result).toMatch(/mrt|mar/i);
  });

  it("includes time", () => {
    const result = formatDateShort("2026-06-20T18:30:00Z");
    expect(result).toMatch(/\d{2}:\d{2}/);
  });
});

describe("toDatetimeLocal", () => {
  it("converts an ISO UTC string to local datetime-local format", () => {
    const result = toDatetimeLocal("2026-03-15T14:00:00Z");
    // Should return YYYY-MM-DDTHH:MM format
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  it("produces a value that round-trips correctly", () => {
    const original = "2026-06-20T18:30:00.000Z";
    const local = toDatetimeLocal(original);
    // Converting local back to ISO should give the same UTC time
    const roundTripped = new Date(local).toISOString();
    expect(roundTripped).toBe(original);
  });

  it("preserves local time representation", () => {
    // Create a date in local time and convert to ISO, then back
    const localDate = new Date(2026, 5, 20, 14, 30); // June 20, 2026 14:30 local
    const iso = localDate.toISOString();
    const result = toDatetimeLocal(iso);
    expect(result).toBe("2026-06-20T14:30");
  });
});

describe("calculateGatheringTime", () => {
  it("subtracts default minutes from match date", () => {
    const result = calculateGatheringTime("2026-03-15T14:00:00Z", 60);
    expect(result.toISOString()).toBe("2026-03-15T13:00:00.000Z");
  });

  it("subtracts default minutes plus travel time", () => {
    const result = calculateGatheringTime("2026-03-15T14:00:00Z", 60, 30);
    expect(result.toISOString()).toBe("2026-03-15T12:30:00.000Z");
  });

  it("handles null travel time as zero", () => {
    const result = calculateGatheringTime("2026-03-15T14:00:00Z", 60, null);
    expect(result.toISOString()).toBe("2026-03-15T13:00:00.000Z");
  });

  it("handles zero default minutes", () => {
    const result = calculateGatheringTime("2026-03-15T14:00:00Z", 0);
    expect(result.toISOString()).toBe("2026-03-15T14:00:00.000Z");
  });

  it("handles large total offset", () => {
    const result = calculateGatheringTime("2026-03-15T14:00:00Z", 120, 45);
    expect(result.toISOString()).toBe("2026-03-15T11:15:00.000Z");
  });
});

describe("formatTime", () => {
  it("formats a Date object to HH:mm", () => {
    const result = formatTime(new Date("2026-03-15T14:30:00Z"));
    expect(result).toMatch(/\d{2}:\d{2}/);
  });

  it("formats an ISO string to HH:mm", () => {
    const result = formatTime("2026-03-15T14:30:00Z");
    expect(result).toMatch(/\d{2}:\d{2}/);
  });
});

describe("getInviteUrl", () => {
  it("builds a URL with the invite code", () => {
    const url = getInviteUrl("ABC123");
    expect(url).toContain("/join/ABC123");
  });

  it("uses the base URL from env or fallback", () => {
    const url = getInviteUrl("XYZ");
    // In Node test env without window, should use env or fallback
    expect(url).toMatch(/^https?:\/\/.+\/join\/XYZ$/);
  });
});
