import exerciseGuides from "@/content/exercise-guides.json";
import ageGuides from "@/content/age-guides.json";

/**
 * Coaching content for the public exercise and age-group pages. Kept in the
 * repo rather than the database: it is editorial SEO copy, not exercise data
 * the app edits. Keyed by the page slug.
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ExerciseGuide {
  slug: string;
  metaDescription: string;
  goal: string;
  coachingPoints: string[];
  mistakes: string[];
  easier: string;
  harder: string;
  ageTip: string;
  faq: FaqItem[];
}

export interface AgeGroupGuide {
  slug: string;
  metaDescription: string;
  focus: string[];
  session: string;
  faq: FaqItem[];
}

const exerciseMap = new Map((exerciseGuides as ExerciseGuide[]).map((g) => [g.slug, g]));
const ageMap = new Map((ageGuides as AgeGroupGuide[]).map((g) => [g.slug, g]));

export function getExerciseGuide(slug: string): ExerciseGuide | undefined {
  return exerciseMap.get(slug);
}

export function getAgeGroupGuide(slug: string): AgeGroupGuide | undefined {
  return ageMap.get(slug);
}

/** "Mistake: fix" → ["Mistake", "fix"]; a line without a colon has no fix. */
export function splitMistake(line: string): [string, string | null] {
  const i = line.indexOf(":");
  return i === -1 ? [line, null] : [line.slice(0, i).trim(), line.slice(i + 1).trim()];
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
