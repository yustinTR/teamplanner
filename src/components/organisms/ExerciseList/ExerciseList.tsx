"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useExercises } from "@/hooks/use-exercises";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/atoms/EmptyState";
import { ExerciseCard } from "@/components/molecules/ExerciseCard";
import { ExerciseFilterBar } from "@/components/molecules/ExerciseFilterBar";
import type { ExerciseFilters } from "@/types";

interface ExerciseListProps {
  /** If provided, pre-selects the team type filter */
  defaultTeamType?: string;
}

export function ExerciseList({ defaultTeamType }: ExerciseListProps) {
  const { currentTeam } = useAuthStore();
  const teamType = defaultTeamType ?? currentTeam?.team_type;

  const [filters, setFilters] = useState<ExerciseFilters>({
    teamType: teamType ?? undefined,
  });
  const { data: exercises, isLoading } = useExercises(filters);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ExerciseFilterBar filters={filters} onFiltersChange={setFilters} />

      {!exercises?.length ? (
        <EmptyState
          icon={Search}
          title="Geen oefeningen gevonden"
          description="Pas je filters aan om oefeningen te vinden."
          action={
            Object.keys(filters).filter((k) => filters[k as keyof ExerciseFilters] !== undefined).length > 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ teamType: teamType ?? undefined })}
              >
                Filters wissen
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              id={exercise.id}
              title={exercise.title}
              category={exercise.category}
              duration={exercise.duration_minutes}
              minPlayers={exercise.min_players}
              maxPlayers={exercise.max_players}
              difficulty={exercise.difficulty}
            />
          ))}
        </div>
      )}
    </div>
  );
}
