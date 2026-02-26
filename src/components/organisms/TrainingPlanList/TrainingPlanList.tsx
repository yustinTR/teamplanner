"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ClipboardList, BookOpen } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useTrainingPlans, useCreateTrainingPlan } from "@/hooks/use-training-plans";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/atoms/EmptyState";
import { TrainingPlanCard } from "@/components/molecules/TrainingPlanCard";
import { TrainingPlanForm } from "@/components/molecules/TrainingPlanForm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function getExerciseCount(plan: { training_plan_exercises: unknown }): number {
  const tpe = plan.training_plan_exercises;
  if (Array.isArray(tpe)) {
    // Supabase count aggregate returns [{ count: number }]
    if (tpe.length > 0 && typeof tpe[0] === "object" && tpe[0] !== null && "count" in tpe[0]) {
      return (tpe[0] as { count: number }).count;
    }
    return tpe.length;
  }
  return 0;
}

export function TrainingPlanList() {
  const { currentTeam, isCoach } = useAuthStore();
  const { data: plans, isLoading } = useTrainingPlans(currentTeam?.id);
  const createPlan = useCreateTrainingPlan();
  const [createOpen, setCreateOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isCoach && (
        <Sheet open={createOpen} onOpenChange={setCreateOpen}>
          <SheetTrigger asChild>
            <Button className="w-full gap-2">
              <Plus className="size-4" />
              Nieuw trainingsplan
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[70vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Trainingsplan aanmaken</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-4">
              <TrainingPlanForm
                submitLabel="Plan aanmaken"
                onSubmit={async (data) => {
                  if (!currentTeam) return;
                  await createPlan.mutateAsync({
                    team_id: currentTeam.id,
                    title: data.title,
                    notes: data.notes || null,
                  });
                  setCreateOpen(false);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}

      <Link href="/trainingen/oefeningen">
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-primary-300 bg-primary-50/50 p-3 transition-colors hover:bg-primary-50">
          <BookOpen className="size-5 text-primary-600" />
          <span className="text-sm font-medium text-primary-700">
            Oefeningen-bibliotheek bekijken
          </span>
        </div>
      </Link>

      {!plans?.length ? (
        <EmptyState
          icon={ClipboardList}
          title="Geen trainingsplannen"
          description="Maak een trainingsplan aan en voeg oefeningen toe."
        />
      ) : (
        plans.map((plan) => (
          <TrainingPlanCard
            key={plan.id}
            id={plan.id}
            title={plan.title}
            totalDuration={plan.total_duration_minutes}
            exerciseCount={getExerciseCount(plan)}
          />
        ))
      )}
    </div>
  );
}
