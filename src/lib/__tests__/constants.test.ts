import { describe, it, expect } from "vitest";
import {
  FORMATIONS,
  FORMATIONS_11,
  FORMATIONS_7,
  AVAILABILITY_LABELS,
  MATCH_STATUS_LABELS,
  POSITION_LABELS,
  DETAILED_POSITION_LABELS,
  POSITION_GROUPS,
  POSITION_TO_CATEGORY,
  ROLE_LABELS,
  HOME_AWAY_LABELS,
} from "../constants";

describe("FORMATIONS_11", () => {
  const formationNames = Object.keys(FORMATIONS_11);

  it("has at least one formation defined", () => {
    expect(formationNames.length).toBeGreaterThan(0);
  });

  it.each(formationNames)("%s has exactly 11 positions", (name) => {
    expect(FORMATIONS_11[name]).toHaveLength(11);
  });
});

describe("FORMATIONS_7", () => {
  const formationNames = Object.keys(FORMATIONS_7);

  it("has at least one formation defined", () => {
    expect(formationNames.length).toBeGreaterThan(0);
  });

  it.each(formationNames)("%s has exactly 7 positions", (name) => {
    expect(FORMATIONS_7[name]).toHaveLength(7);
  });
});

describe("FORMATIONS (combined)", () => {
  const formationNames = Object.keys(FORMATIONS);

  it("includes both 11v11 and 7v7 formations", () => {
    expect(formationNames).toContain("4-3-3");
    expect(formationNames).toContain("2-3-1");
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

describe("DETAILED_POSITION_LABELS", () => {
  it("contains all 14 detailed positions", () => {
    const expected = ["K", "CB", "LB", "RB", "LWB", "RWB", "CM", "CDM", "CAM", "LM", "RM", "LW", "RW", "ST"];
    for (const pos of expected) {
      expect(DETAILED_POSITION_LABELS).toHaveProperty(pos);
    }
  });

  it("has Dutch labels", () => {
    expect(DETAILED_POSITION_LABELS.K).toBe("Keeper");
    expect(DETAILED_POSITION_LABELS.ST).toBe("Spits");
    expect(DETAILED_POSITION_LABELS.CB).toBe("Centrale Verdediger");
  });
});

describe("POSITION_LABELS (backward compat)", () => {
  it("is the same object as DETAILED_POSITION_LABELS", () => {
    expect(POSITION_LABELS).toBe(DETAILED_POSITION_LABELS);
  });
});

describe("POSITION_GROUPS", () => {
  it("has 4 groups", () => {
    expect(POSITION_GROUPS).toHaveLength(4);
  });

  it("covers all positions in DETAILED_POSITION_LABELS", () => {
    const allPositions = POSITION_GROUPS.flatMap((g) => g.positions);
    const labelPositions = Object.keys(DETAILED_POSITION_LABELS);
    expect(allPositions.sort()).toEqual(labelPositions.sort());
  });
});

describe("POSITION_TO_CATEGORY", () => {
  it("maps every detailed position to a category", () => {
    for (const pos of Object.keys(DETAILED_POSITION_LABELS)) {
      expect(POSITION_TO_CATEGORY).toHaveProperty(pos);
    }
  });

  it("maps K to goalkeeper", () => {
    expect(POSITION_TO_CATEGORY.K).toBe("goalkeeper");
  });

  it("maps CB to defender", () => {
    expect(POSITION_TO_CATEGORY.CB).toBe("defender");
  });

  it("maps CM to midfielder", () => {
    expect(POSITION_TO_CATEGORY.CM).toBe("midfielder");
  });

  it("maps ST to forward", () => {
    expect(POSITION_TO_CATEGORY.ST).toBe("forward");
  });
});

describe("ROLE_LABELS", () => {
  it("contains player and staff roles", () => {
    expect(ROLE_LABELS).toHaveProperty("player");
    expect(ROLE_LABELS).toHaveProperty("staff");
  });

  it("has Dutch labels", () => {
    expect(ROLE_LABELS.player).toBe("Speler");
    expect(ROLE_LABELS.staff).toBe("Teammanager");
  });
});

describe("HOME_AWAY_LABELS", () => {
  it("contains home and away", () => {
    expect(HOME_AWAY_LABELS).toHaveProperty("home");
    expect(HOME_AWAY_LABELS).toHaveProperty("away");
  });
});
