import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { ExerciseCard } from "@/components/molecules/ExerciseCard";
import { EXERCISE_CATEGORY_LABELS } from "@/lib/constants";
import {
  AGE_GROUPS,
  EXERCISES_BASE_PATH,
  exercisePath,
  getPublishedExercises,
  groupByCategory,
} from "@/lib/public-exercises";

export const revalidate = 86400;

const url = `https://www.myteamplanner.nl${EXERCISES_BASE_PATH}`;

export const metadata: Metadata = {
  title: "Voetbaloefeningen voor je training (gratis)",
  description:
    "Kant-en-klare voetbaloefeningen voor jeugd en senioren: warming-up, passing, positiespel, verdedigen, aanvallen, afwerken en conditie. Met opzet, duur en variaties.",
  keywords: [
    "voetbaloefeningen",
    "voetbal oefeningen",
    "trainingsoefeningen voetbal",
    "voetbaltraining oefeningen",
    "oefeningen jeugdvoetbal",
  ],
  alternates: { canonical: url },
  openGraph: {
    title: "Voetbaloefeningen voor je training",
    description: "Kant-en-klare oefeningen voor jeugd en senioren, gesorteerd op thema en leeftijd.",
    url,
    type: "website",
    siteName: "MyTeamPlanner",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
  },
};

export default async function ExercisesHubPage() {
  const exercises = await getPublishedExercises();
  const groups = groupByCategory(exercises);

  return (
    <div className="min-h-screen bg-white">
      <main className="px-4 pb-16 pt-10">
        <div className="mx-auto max-w-4xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Voetbaloefeningen" }]} />

          <h1 className="mt-4 text-3xl font-bold text-neutral-900">Voetbaloefeningen voor je training</h1>
          <p className="mt-3 max-w-2xl text-neutral-600">
            {exercises.length} kant-en-klare oefeningen voor jeugd en senioren, elk met opzet, duur,
            aantal spelers en variaties. Kies een thema of zoek oefeningen voor jouw leeftijdsgroep.
          </p>

          <nav aria-label="Per leeftijd" className="mt-6">
            <h2 className="text-sm font-semibold text-neutral-700">Per leeftijd</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {AGE_GROUPS.map((g) => (
                <Link
                  key={g.slug}
                  href={`${EXERCISES_BASE_PATH}/leeftijd/${g.slug}`}
                  className="inline-flex min-h-[44px] items-center rounded-full border border-neutral-200 px-4 text-sm font-medium text-neutral-700 hover:border-primary-300 hover:text-primary-700"
                >
                  {g.label === "senioren" ? "Senioren" : g.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Per thema" className="mt-6">
            <h2 className="text-sm font-semibold text-neutral-700">Per thema</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {groups.map(([category, list]) => (
                <a
                  key={category}
                  href={`#${category}`}
                  className="inline-flex min-h-[44px] items-center rounded-full bg-neutral-100 px-4 text-sm font-medium text-neutral-700 hover:bg-primary-50 hover:text-primary-700"
                >
                  {EXERCISE_CATEGORY_LABELS[category] ?? category} ({list.length})
                </a>
              ))}
            </div>
          </nav>

          {groups.map(([category, list]) => (
            <section key={category} id={category} className="mt-10 scroll-mt-4">
              <h2 className="text-xl font-bold text-neutral-900">
                {EXERCISE_CATEGORY_LABELS[category] ?? category}
              </h2>
              <div className="-mx-3 mt-2 grid sm:grid-cols-2 lg:grid-cols-3">
                {list.map((e) => (
                  <ExerciseCard
                    key={e.id}
                    id={e.id}
                    href={exercisePath(e.title)}
                    title={e.title}
                    category={e.category}
                    duration={e.duration_minutes}
                    minPlayers={e.min_players}
                    maxPlayers={e.max_players}
                    difficulty={e.difficulty}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
