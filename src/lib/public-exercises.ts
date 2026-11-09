import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { Exercise } from "@/types";

/**
 * Public, indexable exercise pages under `/voetbaloefeningen`. Published
 * exercises are readable with the anon key (RLS policy on `exercises`), so
 * these pages need no session and can be statically generated.
 */
export const EXERCISES_BASE_PATH = "/voetbaloefeningen";

export interface AgeGroup {
  slug: string;
  /** "JO8 en JO9" */
  label: string;
  /** Team type the exercises are tagged with. */
  teamType: string;
  /** "6 tegen 6" */
  format: string;
  intro: string;
}

export const AGE_GROUPS: AgeGroup[] = [
  {
    slug: "jo8-jo9",
    label: "JO8 en JO9",
    teamType: "jo9_jo8",
    format: "6 tegen 6",
    intro:
      "Bij JO8 en JO9 draait het om veel balcontacten en plezier. Kies korte oefeningen met weinig uitleg, kleine groepjes en altijd een doeltje of een wedstrijdelement.",
  },
  {
    slug: "jo10",
    label: "JO10",
    teamType: "jo10",
    format: "6 tegen 6",
    intro:
      "JO10 speelt het laatste jaar 6 tegen 6. Naast dribbelen en passen kun je spelers nu ook leren vrijlopen en de ruimte zoeken.",
  },
  {
    slug: "jo11-jo12",
    label: "JO11 en JO12",
    teamType: "jo12_jo11",
    format: "8 tegen 8",
    intro:
      "Bij 8 tegen 8 krijgen spelers voor het eerst vaste posities. Oefen positiespel en overtal, en laat iedereen op verschillende plekken spelen.",
  },
  {
    slug: "jo13-jo15",
    label: "JO13 tot en met JO15",
    teamType: "jo15_jo13",
    format: "11 tegen 11",
    intro:
      "Vanaf JO13 speel je 11 tegen 11 op een heel veld. Samenwerken in linies, omschakelen en conditie worden belangrijker.",
  },
  {
    slug: "jo17-jo19",
    label: "JO17 en JO19",
    teamType: "jo19_jo17",
    format: "11 tegen 11",
    intro:
      "Oudere jeugd traint bijna als senioren: tactische partijvormen, pressing, afwerken onder druk en gerichte conditietraining.",
  },
  {
    slug: "senioren",
    label: "senioren",
    teamType: "senioren",
    format: "11 tegen 11",
    intro:
      "Voor seniorenteams in het amateurvoetbal: oefeningen die met wisselende opkomst werken en in een training van anderhalf uur passen.",
  },
];

export function getAgeGroup(slug: string): AgeGroup | undefined {
  return AGE_GROUPS.find((g) => g.slug === slug);
}

/** "Aanvallen voor pupillen: 2 tegen 1" → "aanvallen-voor-pupillen-2-tegen-1" */
export function exerciseSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function exercisePath(title: string): string {
  return `${EXERCISES_BASE_PATH}/${exerciseSlug(title)}`;
}

export function exercisesForAgeGroup(exercises: Exercise[], group: AgeGroup): Exercise[] {
  return exercises.filter((e) => e.team_types?.includes(group.teamType));
}

/** Up to `limit` other exercises from the same category, for internal links. */
export function relatedExercises(exercises: Exercise[], exercise: Exercise, limit = 4): Exercise[] {
  return exercises
    .filter((e) => e.category === exercise.category && e.id !== exercise.id)
    .slice(0, limit);
}

/** Groups exercises by category, keeping the order the categories first appear in. */
export function groupByCategory(exercises: Exercise[]): [string, Exercise[]][] {
  const groups = new Map<string, Exercise[]>();
  for (const e of exercises) {
    const list = groups.get(e.category) ?? [];
    list.push(e);
    groups.set(e.category, list);
  }
  return [...groups.entries()];
}

/** First sentence of a description, capped for meta descriptions. */
export function shortDescription(text: string, max = 155): string {
  const firstSentence = text.split(/(?<=[.!?])\s/)[0] ?? text;
  const base = firstSentence.length >= 60 ? firstSentence : text;
  return base.length <= max ? base : `${base.slice(0, max - 1).trimEnd()}…`;
}

export const getPublishedExercises = cache(async (): Promise<Exercise[]> => {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("is_published", true)
    .order("category")
    .order("title");
  if (error) throw error;
  return data;
});

export async function getExerciseBySlug(slug: string): Promise<Exercise | undefined> {
  const exercises = await getPublishedExercises();
  return exercises.find((e) => exerciseSlug(e.title) === slug);
}
