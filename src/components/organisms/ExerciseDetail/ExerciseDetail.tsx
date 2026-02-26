"use client";

import Image from "next/image";
import { Clock, Users, BarChart3, Dumbbell } from "lucide-react";
import { useExercise } from "@/hooks/use-exercises";
import { Spinner } from "@/components/atoms/Spinner";
import { Badge } from "@/components/ui/badge";
import {
  EXERCISE_CATEGORY_LABELS,
  EXERCISE_DIFFICULTY_LABELS,
  TEAM_TYPE_LABELS,
} from "@/lib/constants";

const DIFFICULTY_COLORS: Record<string, string> = {
  basis: "bg-green-100 text-green-700",
  gemiddeld: "bg-amber-100 text-amber-700",
  gevorderd: "bg-red-100 text-red-700",
};

interface ExerciseDetailProps {
  exerciseId: string;
}

export function ExerciseDetail({ exerciseId }: ExerciseDetailProps) {
  const { data: exercise, isLoading } = useExercise(exerciseId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Oefening niet gevonden
      </div>
    );
  }

  const playerRange =
    exercise.min_players && exercise.max_players
      ? `${exercise.min_players}-${exercise.max_players} spelers`
      : exercise.min_players
        ? `${exercise.min_players}+ spelers`
        : exercise.max_players
          ? `Max ${exercise.max_players} spelers`
          : null;

  return (
    <div className="space-y-6">
      {/* Category illustration hero */}
      <div className="relative h-36 w-full overflow-hidden rounded-xl bg-neutral-50">
        <Image
          src={`/exercises/${exercise.category}.svg`}
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900">{exercise.title}</h1>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline">
            {EXERCISE_CATEGORY_LABELS[exercise.category] ?? exercise.category}
          </Badge>
          <Badge
            variant="secondary"
            className={DIFFICULTY_COLORS[exercise.difficulty] ?? ""}
          >
            {EXERCISE_DIFFICULTY_LABELS[exercise.difficulty] ?? exercise.difficulty}
          </Badge>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center rounded-xl bg-neutral-50 p-3">
          <Clock className="mb-1 size-5 text-primary-600" />
          <span className="text-sm font-semibold">{exercise.duration_minutes} min</span>
          <span className="text-xs text-muted-foreground">Duur</span>
        </div>
        {playerRange && (
          <div className="flex flex-col items-center rounded-xl bg-neutral-50 p-3">
            <Users className="mb-1 size-5 text-primary-600" />
            <span className="text-center text-sm font-semibold">{exercise.min_players}-{exercise.max_players}</span>
            <span className="text-xs text-muted-foreground">Spelers</span>
          </div>
        )}
        <div className="flex flex-col items-center rounded-xl bg-neutral-50 p-3">
          <BarChart3 className="mb-1 size-5 text-primary-600" />
          <span className="text-sm font-semibold">{EXERCISE_DIFFICULTY_LABELS[exercise.difficulty]}</span>
          <span className="text-xs text-muted-foreground">Niveau</span>
        </div>
      </div>

      {/* Team types */}
      {exercise.team_types && exercise.team_types.length > 0 && (
        <div>
          <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
            <Dumbbell className="size-4" />
            Geschikt voor
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {exercise.team_types.map((tt) => (
              <Badge key={tt} variant="outline" className="text-xs">
                {TEAM_TYPE_LABELS[tt] ?? tt}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <h2 className="mb-2 text-sm font-semibold text-neutral-700">Beschrijving</h2>
        <p className="text-sm leading-relaxed text-neutral-600">{exercise.description}</p>
      </div>

      {/* Setup instructions */}
      {exercise.setup_instructions && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-neutral-700">Opzet</h2>
          <p className="text-sm leading-relaxed text-neutral-600">{exercise.setup_instructions}</p>
        </div>
      )}

      {/* Variations */}
      {exercise.variations && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-neutral-700">Variaties</h2>
          <p className="text-sm leading-relaxed text-neutral-600">{exercise.variations}</p>
        </div>
      )}

      {/* Video */}
      {exercise.video_url && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-neutral-700">Video</h2>
          <div className="aspect-video overflow-hidden rounded-xl">
            <iframe
              src={exercise.video_url}
              className="size-full"
              allowFullScreen
              title={exercise.title}
            />
          </div>
        </div>
      )}
    </div>
  );
}
