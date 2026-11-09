import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { ExerciseCard } from "@/components/molecules/ExerciseCard";
import { EXERCISE_CATEGORY_LABELS } from "@/lib/constants";
import {
  AGE_GROUPS,
  EXERCISES_BASE_PATH,
  exercisePath,
  exercisesForAgeGroup,
  getAgeGroup,
  getPublishedExercises,
  groupByCategory,
} from "@/lib/public-exercises";

export const revalidate = 86400;
export const dynamicParams = false;

interface AgeGroupPageProps {
  params: Promise<{ groep: string }>;
}

export function generateStaticParams() {
  return AGE_GROUPS.map((g) => ({ groep: g.slug }));
}

export async function generateMetadata({ params }: AgeGroupPageProps): Promise<Metadata> {
  const { groep } = await params;
  const group = getAgeGroup(groep);
  if (!group) return {};
  const url = `https://www.myteamplanner.nl${EXERCISES_BASE_PATH}/leeftijd/${group.slug}`;
  const title = `Voetbaloefeningen voor ${group.label}`;
  return {
    title: `${title} (${group.format})`,
    description: `Trainingsoefeningen voor ${group.label} (${group.format}): warming-up, passing, positiespel, verdedigen, aanvallen en afwerken. Met opzet, duur en variaties.`,
    alternates: { canonical: url },
    openGraph: { title, url, type: "website", siteName: "MyTeamPlanner", images: [{ url: "/api/og", width: 1200, height: 630 }] },
  };
}

export default async function AgeGroupExercisesPage({ params }: AgeGroupPageProps) {
  const { groep } = await params;
  const group = getAgeGroup(groep);
  if (!group) notFound();

  const exercises = exercisesForAgeGroup(await getPublishedExercises(), group);
  const groups = groupByCategory(exercises);

  return (
    <div className="min-h-screen bg-white">
      <main className="px-4 pb-16 pt-10">
        <div className="mx-auto max-w-4xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Voetbaloefeningen", href: EXERCISES_BASE_PATH },
              { label: group.label === "senioren" ? "Senioren" : group.label },
            ]}
          />

          <h1 className="mt-4 text-3xl font-bold text-neutral-900">Voetbaloefeningen voor {group.label}</h1>
          <p className="mt-3 max-w-2xl text-neutral-600">
            {group.intro} Hieronder staan {exercises.length} oefeningen die passen bij {group.format}.
          </p>

          {groups.map(([category, list]) => (
            <section key={category} className="mt-10">
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

          <div className="mt-12 rounded-2xl bg-neutral-50 p-5">
            <h2 className="font-semibold text-neutral-900">Ook handig voor {group.format}</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Maak gratis een eerlijk wisselschema of een opstelling voor je wedstrijd.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm font-medium">
              <Link href="/tools/wisselschema" className="inline-flex min-h-[44px] items-center text-primary-700 hover:underline">
                Wisselschema maken
              </Link>
              <Link href="/tools/opstelling" className="inline-flex min-h-[44px] items-center text-primary-700 hover:underline">
                Opstelling maken
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
