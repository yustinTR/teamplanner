import { describe, it, expect } from "vitest";
import {
  FORMATIONS,
  AVAILABILITY_LABELS,
  MATCH_STATUS_LABELS,
  POSITION_LABELS,
  HOME_AWAY_LABELS,
} from "../constants";

describe("FORMATIONS", () => {
  const formationNames = Object.keys(FORMATIONS);

  it("has at least one formation defined", () => {
    expect(formationNames.length).toBeGreaterThan(0);
  });

  it.each(formationNames)("%s has exactly 11 positions", (name) => {
    expect(FORMATIONS[name]).toHaveLength(11);
  });

  it.each(formationNames)(
    "%s has x values between 0 and 100",
    (name) => {
      for (const pos of FORMATIONS[name]) {
        expect(pos.x).toBeGreaterThanOrEqual(0);
        expect(pos.x).toBeLessThanOrEqual(100);
      }
    }
  );

  it.each(formationNames)(
    "%s has y values between 0 and 100",
    (name) => {
      for (const pos of FORMATIONS[name]) {
        expect(pos.y).toBeGreaterThanOrEqual(0);
        expect(pos.y).toBeLessThanOrEqual(100);
      }
    }
  );

  it.each(formationNames)(
    "%s has a position_label on every position",
    (name) => {
      for (const pos of FORMATIONS[name]) {
        expect(pos.position_label).toBeTruthy();
        expect(typeof pos.position_label).toBe("string");
      }
    }
  );
});

describe("AVAILABILITY_LABELS", () => {
  it("contains all three statuses", () => {
    expect(AVAILABILITY_LABELS).toHaveProperty("available");
    expect(AVAILABILITY_LABELS).toHaveProperty("unavailable");
    expect(AVAILABILITY_LABELS).toHaveProperty("maybe");
  });

  it("has Dutch labels", () => {
    expect(AVAILABILITY_LABELS.available).toBe("Beschikbaar");
    expect(AVAILABILITY_LABELS.unavailable).toBe("Afwezig");
    expect(AVAILABILITY_LABELS.maybe).toBe("Misschien");
  });
});

describe("MATCH_STATUS_LABELS", () => {
  it("contains all three statuses", () => {
    expect(MATCH_STATUS_LABELS).toHaveProperty("upcoming");
    expect(MATCH_STATUS_LABELS).toHaveProperty("completed");
    expect(MATCH_STATUS_LABELS).toHaveProperty("cancelled");
  });

  it("has Dutch labels", () => {
    expect(MATCH_STATUS_LABELS.upcoming).toBe("Gepland");
    expect(MATCH_STATUS_LABELS.completed).toBe("Gespeeld");
    expect(MATCH_STATUS_LABELS.cancelled).toBe("Afgelast");
  });
});

describe("POSITION_LABELS", () => {
  it("contains the four main positions", () => {
    expect(POSITION_LABELS).toHaveProperty("goalkeeper");
    expect(POSITION_LABELS).toHaveProperty("defender");
    expect(POSITION_LABELS).toHaveProperty("midfielder");
    expect(POSITION_LABELS).toHaveProperty("forward");
  });
});

describe("HOME_AWAY_LABELS", () => {
  it("contains home and away", () => {
    expect(HOME_AWAY_LABELS).toHaveProperty("home");
    expect(HOME_AWAY_LABELS).toHaveProperty("away");
  });
});
