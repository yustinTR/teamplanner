"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EXERCISE_CATEGORY_LABELS, EXERCISE_DIFFICULTY_LABELS } from "@/lib/constants";

const DIFFICULTY_COLORS: Record<string, string> = {
  basis: "bg-green-100 text-green-700",
  gemiddeld: "bg-amber-100 text-amber-700",
  gevorderd: "bg-red-100 text-red-700",
};

interface ExerciseCardProps {
  id: string;
  title: string;
  category: string;
  duration: number;
  minPlayers?: number | null;
  maxPlayers?: number | null;
  difficulty: string;
}

export function ExerciseCard({
  id,
  title,
  category,
  duration,
  minPlayers,
  maxPlayers,
  difficulty,
}: ExerciseCardProps) {
  const playerRange =
    minPlayers && maxPlayers
      ? `${minPlayers}-${maxPlayers}`
      : minPlayers
        ? `${minPlayers}+`
        : maxPlayers
          ? `max ${maxPlayers}`
          : null;

  return (
    <Link href={`/trainingen/oefeningen/${id}`}>
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md">
        {/* Category illustration */}
        <div className="relative h-24 w-full overflow-hidden bg-neutral-50">
          <Image
            src={`/exercises/${category}.svg`}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-neutral-900">{title}</h3>
            <Badge
              variant="secondary"
              className={`shrink-0 text-xs ${DIFFICULTY_COLORS[difficulty] ?? ""}`}
            >
              {EXERCISE_DIFFICULTY_LABELS[difficulty] ?? difficulty}
            </Badge>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              {EXERCISE_CATEGORY_LABELS[category] ?? category}
            </Badge>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {duration} min
            </span>
            {playerRange && (
              <span className="flex items-center gap-1">
                <Users className="size-3.5" />
                {playerRange}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
