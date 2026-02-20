"use client";

import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import { formatMatchDate } from "@/lib/utils";

interface EventCardProps {
  id: string;
  title: string;
  eventDate: string;
  location?: string | null;
  comingCount?: number;
}

export function EventCard({ id, title, eventDate, location, comingCount }: EventCardProps) {
  return (
    <Link href={`/events/${id}`}>
      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
        <h3 className="font-semibold text-neutral-900">{title}</h3>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {formatMatchDate(eventDate)}
          </p>
          {location && (
            <p className="flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {location}
            </p>
          )}
        </div>
        {comingCount !== undefined && (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary-600">
            <Users className="size-3.5" />
            {comingCount} aanwezig
          </div>
        )}
      </div>
    </Link>
  );
}
