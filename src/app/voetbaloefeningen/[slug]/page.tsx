import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { ExerciseCard } from "@/components/molecules/ExerciseCard";
import { ExerciseContent } from "@/components/molecules/ExerciseContent";
import { ExerciseSignupCta } from "@/components/molecules/ExerciseSignupCta";
import { EXERCISE_CATEGORY_LABELS } from "@/lib/constants";
import {
  EXERCISES_BASE_PATH,
  exercisePath,
  exerciseSlug,
  getExerciseBySlug,
  getPublishedExercises,
  relatedExercises,
  shortDescription,
} from "@/lib/public-exercises";

export const revalidate = 86400;

interface ExercisePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const exercises = await getPublishedExercises();
  return exercises.map((e) => ({ slug: exerciseSlug(e.title) }));
}

export async function generateMetadata({ params }: ExercisePageProps): Promise<Metadata> {
  const { slug } = await params;
  const exercise = await getExerciseBySlug(slug);
  if (!exercise) return {};

  const category = EXERCISE_CATEGORY_LABELS[exercise.category] ?? exercise.category;
  const url = `https://www.myteamplanner.nl${exercisePath(exercise.title)}`;
  const description = shortDescription(exercise.description);
  return {
    title: `${exercise.title} — voetbaloefening ${category.toLowerCase()}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${exercise.title} — voetbaloefening`,
      description,
      url,
      type: "article",
      siteName: "MyTeamPlanner",
      images: [{ url: "/api/og", width: 1200, height: 630 }],
    },
  };
}

export default async function PublicExercisePage({ params }: ExercisePageProps) {
  const { slug } = await params;
  const [exercise, exercises] = await Promise.all([getExerciseBySlug(slug), getPublishedExercises()]);
  if (!exercise) notFound();

  const category = EXERCISE_CATEGORY_LABELS[exercise.category] ?? exercise.category;
  const related = relatedExercises(exercises, exercise);

  return (
    <div className="min-h-screen bg-white">
      <main className="px-4 pb-16 pt-10">
        <div className="mx-auto max-w-2xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Voetbaloefeningen", href: EXERCISES_BASE_PATH },
              { label: exercise.title },
            ]}
          />

          <div className="mt-4">
            <ExerciseContent exercise={exercise} />
          </div>

          <div className="mt-8">
            <ExerciseSignupCta exerciseId={exercise.id} exerciseSlug={slug} />
          </div>

          {related.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-bold text-neutral-900">Meer oefeningen: {category.toLowerCase()}</h2>
              <div className="-mx-3 mt-2 grid sm:grid-cols-2">
                {related.map((e) => (
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
              <Link
                href={`${EXERCISES_BASE_PATH}#${exercise.category}`}
                className="mt-2 inline-flex min-h-[44px] items-center text-sm font-medium text-primary-700 hover:underline"
              >
                Alle oefeningen voor {category.toLowerCase()}
              </Link>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
