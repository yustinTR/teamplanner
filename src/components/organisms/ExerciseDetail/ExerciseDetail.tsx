"use client";

import { useExercise } from "@/hooks/use-exercises";
import { Spinner } from "@/components/atoms/Spinner";
import { ExerciseContent } from "@/components/molecules/ExerciseContent";

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

  return <ExerciseContent exercise={exercise} />;
}
