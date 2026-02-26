"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import { Clock, Plus, ListChecks } from "lucide-react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAuthStore } from "@/stores/auth-store";
import { useTrainingPlan } from "@/hooks/use-training-plans";
import {
  useRemoveExerciseFromPlan,
  useReorderPlanExercises,
} from "@/hooks/use-training-plan-exercises";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { PlanExerciseItem } from "@/components/molecules/PlanExerciseItem";
import type { TrainingPlanExerciseWithExercise } from "@/types";

interface TrainingPlanDetailProps {
  planId: string;
}

function SortableExercise({
  item,
  isCoach,
  onRemove,
}: {
  item: TrainingPlanExerciseWithExercise;
  isCoach: boolean;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <PlanExerciseItem
        id={item.id}
        title={item.exercises.title}
        category={item.exercises.category}
        duration={item.exercises.duration_minutes}
        isCoach={isCoach}
        onRemove={onRemove}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function TrainingPlanDetail({ planId }: TrainingPlanDetailProps) {
  const { isCoach } = useAuthStore();
  const { data: plan, isLoading } = useTrainingPlan(planId);
  const removeExercise = useRemoveExerciseFromPlan();
  const reorderExercises = useReorderPlanExercises();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const exercises = useMemo(
    () => (plan?.training_plan_exercises ?? []) as TrainingPlanExerciseWithExercise[],
    [plan?.training_plan_exercises]
  );

  const totalDuration = exercises.reduce(
    (sum, item) => sum + (item.exercises?.duration_minutes ?? 0),
    0
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = exercises.findIndex((e) => e.id === active.id);
      const newIndex = exercises.findIndex((e) => e.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(exercises, oldIndex, newIndex);
      reorderExercises.mutate({
        planId,
        exercises: reordered.map((e, i) => ({ id: e.id, sort_order: i })),
      });
    },
    [exercises, planId, reorderExercises]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Trainingsplan niet gevonden
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Plan info */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900">{plan.title}</h1>
        {plan.notes && (
          <p className="mt-1 text-sm text-muted-foreground">{plan.notes}</p>
        )}
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <ListChecks className="size-4" />
            {exercises.length} {exercises.length === 1 ? "oefening" : "oefeningen"}
          </span>
          {totalDuration > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="size-4" />
              {totalDuration} min totaal
            </span>
          )}
        </div>
      </div>

      {/* Exercise list (sortable for coach) */}
      {exercises.length > 0 ? (
        isCoach ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={exercises.map((e) => e.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {exercises.map((item) => (
                  <SortableExercise
                    key={item.id}
                    item={item}
                    isCoach={isCoach}
                    onRemove={() =>
                      removeExercise.mutate({ id: item.id, planId })
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="space-y-2">
            {exercises.map((item) => (
              <PlanExerciseItem
                key={item.id}
                id={item.id}
                title={item.exercises.title}
                category={item.exercises.category}
                duration={item.exercises.duration_minutes}
              />
            ))}
          </div>
        )
      ) : (
        <div className="rounded-xl border border-dashed border-neutral-300 py-8 text-center text-sm text-muted-foreground">
          Nog geen oefeningen toegevoegd
        </div>
      )}

      {/* Add exercise button */}
      {isCoach && (
        <Link href={`/trainingen/oefeningen?planId=${planId}`}>
          <Button variant="outline" className="w-full gap-2">
            <Plus className="size-4" />
            Oefening toevoegen
          </Button>
        </Link>
      )}
    </div>
  );
}
