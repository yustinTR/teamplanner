import { describe, it, expect } from "vitest";
import {
  isOldSkillsFormat,
  migrateOldSkills,
  ensureEafcFormat,
  calculateCategoryAverage,
  calculateSixStats,
  calculateOverallRating,
  getCardTier,
  hasEafcSkills,
} from "../player-rating";
import { EAFC_ATTRIBUTE_CATEGORIES } from "../constants";

describe("player-rating", () => {
  describe("isOldSkillsFormat", () => {
    it("returns true for old v1 skill keys", () => {
      expect(isOldSkillsFormat({ speed: 7, strength: 5 })).toBe(true);
    });

    it("returns false for EAFC keys", () => {
      expect(isOldSkillsFormat({ acceleration: 80, sprint_speed: 75 })).toBe(false);
    });

    it("returns false for empty skills", () => {
      expect(isOldSkillsFormat({})).toBe(false);
    });
  });

  describe("migrateOldSkills", () => {
    it("maps old skills to new EAFC attributes", () => {
      const old = { speed: 7, finishing: 8 };
      const result = migrateOldSkills(old);

      // speed maps to acceleration and sprint_speed
      expect(result.acceleration).toBeGreaterThan(0);
      expect(result.sprint_speed).toBeGreaterThan(0);
      // finishing maps to finishing, shot_power, volleys
      expect(result.finishing).toBeGreaterThan(0);
      expect(result.shot_power).toBeGreaterThan(0);
    });

    it("clamps values to 1-99", () => {
      const old = { speed: 10, strength: 10 };
      const result = migrateOldSkills(old);

      for (const val of Object.values(result)) {
        expect(val).toBeGreaterThanOrEqual(1);
        expect(val).toBeLessThanOrEqual(99);
      }
    });

    it("handles minimum values (1)", () => {
      const old = { speed: 1, strength: 1 };
      const result = migrateOldSkills(old);

      for (const val of Object.values(result)) {
        expect(val).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe("ensureEafcFormat", () => {
    it("returns empty object for null/undefined", () => {
      expect(ensureEafcFormat(null)).toEqual({});
      expect(ensureEafcFormat(undefined)).toEqual({});
    });

    it("migrates old format", () => {
      const result = ensureEafcFormat({ speed: 7 });
      expect(result.acceleration).toBeDefined();
    });

    it("passes through EAFC format unchanged", () => {
      const skills = { acceleration: 80, sprint_speed: 75 };
      expect(ensureEafcFormat(skills)).toBe(skills);
    });
  });

  describe("calculateCategoryAverage", () => {
    it("calculates average of category attributes", () => {
      const skills = { acceleration: 80, sprint_speed: 60 };
      const result = calculateCategoryAverage(skills, EAFC_ATTRIBUTE_CATEGORIES[0]);
      expect(result).toBe(70);
    });

    it("defaults missing attributes to 50", () => {
      const skills = { acceleration: 90 };
      const result = calculateCategoryAverage(skills, EAFC_ATTRIBUTE_CATEGORIES[0]);
      // (90 + 50) / 2 = 70
      expect(result).toBe(70);
    });
  });

  describe("calculateSixStats", () => {
    it("returns all six stats", () => {
      const skills = { acceleration: 80, sprint_speed: 80 };
      const stats = calculateSixStats(skills);

      expect(stats).toHaveProperty("pac");
      expect(stats).toHaveProperty("sho");
      expect(stats).toHaveProperty("pas");
      expect(stats).toHaveProperty("dri");
      expect(stats).toHaveProperty("def");
      expect(stats).toHaveProperty("phy");

      expect(stats.pac).toBe(80);
      // Other categories default to 50
      expect(stats.sho).toBe(50);
    });
  });

  describe("calculateOverallRating", () => {
    it("calculates position-weighted overall", () => {
      const skills: Record<string, number> = {};
      // Set all attributes to 80
      for (const cat of EAFC_ATTRIBUTE_CATEGORIES) {
        for (const attr of cat.attributes) {
          skills[attr.key] = 80;
        }
      }
      const result = calculateOverallRating(skills, "ST");
      expect(result).toBe(80);
    });

    it("uses default weights when no position", () => {
      const skills: Record<string, number> = {};
      for (const cat of EAFC_ATTRIBUTE_CATEGORIES) {
        for (const attr of cat.attributes) {
          skills[attr.key] = 75;
        }
      }
      const result = calculateOverallRating(skills);
      expect(result).toBe(75);
    });

    it("clamps to 1-99", () => {
      const result = calculateOverallRating({}, "ST");
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(99);
    });

    it("weights shooting higher for ST position", () => {
      const highShootSkills: Record<string, number> = {};
      const highDefSkills: Record<string, number> = {};

      for (const cat of EAFC_ATTRIBUTE_CATEGORIES) {
        for (const attr of cat.attributes) {
          highShootSkills[attr.key] = 50;
          highDefSkills[attr.key] = 50;
        }
      }
      // Boost shooting stats
      for (const attr of EAFC_ATTRIBUTE_CATEGORIES[1].attributes) {
        highShootSkills[attr.key] = 90;
      }
      // Boost defending stats
      for (const attr of EAFC_ATTRIBUTE_CATEGORIES[4].attributes) {
        highDefSkills[attr.key] = 90;
      }

      const stShoot = calculateOverallRating(highShootSkills, "ST");
      const stDef = calculateOverallRating(highDefSkills, "ST");
      expect(stShoot).toBeGreaterThan(stDef);
    });
  });

  describe("getCardTier", () => {
    it("returns gold for 85+", () => {
      expect(getCardTier(85)).toBe("gold");
      expect(getCardTier(99)).toBe("gold");
    });

    it("returns silver for 70-84", () => {
      expect(getCardTier(70)).toBe("silver");
      expect(getCardTier(84)).toBe("silver");
    });

    it("returns bronze for below 70", () => {
      expect(getCardTier(69)).toBe("bronze");
      expect(getCardTier(1)).toBe("bronze");
    });
  });

  describe("hasEafcSkills", () => {
    it("returns false for null/undefined/empty", () => {
      expect(hasEafcSkills(null)).toBe(false);
      expect(hasEafcSkills(undefined)).toBe(false);
      expect(hasEafcSkills({})).toBe(false);
    });

    it("returns true for old format (can be migrated)", () => {
      expect(hasEafcSkills({ speed: 7 })).toBe(true);
    });

    it("returns true for EAFC format", () => {
      expect(hasEafcSkills({ acceleration: 80 })).toBe(true);
    });
  });
});
