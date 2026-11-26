import { describe, expect, it } from "vitest";
import exerciseGuides from "@/content/exercise-guides.json";
import ageGuides from "@/content/age-guides.json";
import { AGE_GROUPS } from "../public-exercises";
import { faqJsonLd, getAgeGroupGuide, getExerciseGuide, splitMistake } from "../exercise-guides";

describe("exercise guides content", () => {
  it("has one guide per slug with full sections", () => {
    const slugs = exerciseGuides.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const g of exerciseGuides) {
      expect(g.coachingPoints.length, g.slug).toBeGreaterThanOrEqual(3);
      expect(g.mistakes.length, g.slug).toBeGreaterThanOrEqual(2);
      expect(g.faq.length, g.slug).toBeGreaterThanOrEqual(1);
      expect(g.goal && g.easier && g.harder && g.ageTip, g.slug).toBeTruthy();
    }
  });

  it("keeps meta descriptions unique and within what Google shows", () => {
    const all = [...exerciseGuides, ...ageGuides].map((g) => g.metaDescription);
    expect(new Set(all).size).toBe(all.length);
    for (const d of all) {
      expect(d.length, d).toBeGreaterThanOrEqual(100);
      expect(d.length, d).toBeLessThanOrEqual(160);
    }
  });

  it("covers every age group", () => {
    for (const group of AGE_GROUPS) {
      expect(getAgeGroupGuide(group.slug), group.slug).toBeDefined();
    }
  });
});

describe("helpers", () => {
  it("finds a guide by slug", () => {
    const first = exerciseGuides[0];
    expect(getExerciseGuide(first.slug)?.goal).toBe(first.goal);
    expect(getExerciseGuide("bestaat-niet")).toBeUndefined();
  });

  it("splits a mistake from its fix", () => {
    expect(splitMistake("Stilstaan: blijf bewegen")).toEqual(["Stilstaan", "blijf bewegen"]);
    expect(splitMistake("Te lange uitleg")).toEqual(["Te lange uitleg", null]);
  });

  it("builds FAQPage structured data", () => {
    const ld = faqJsonLd([{ question: "Vraag?", answer: "Antwoord." }]);
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe("Antwoord.");
  });
});
