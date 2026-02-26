"use client";

import Link from "next/link";
import { Clock, ListChecks } from "lucide-react";

interface TrainingPlanCardProps {
  id: string;
  title: string;
  totalDuration?: number | null;
  exerciseCount: number;
}

export function TrainingPlanCard({ id, title, totalDuration, exerciseCount }: TrainingPlanCardProps) {
  return (
    <Link href={`/trainingen/plannen/${id}`}>
      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
        <h3 className="font-semibold text-neutral-900">{title}</h3>
        <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <ListChecks className="size-3.5" />
            {exerciseCount} {exerciseCount === 1 ? "oefening" : "oefeningen"}
          </span>
          {totalDuration != null && totalDuration > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {totalDuration} min
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
