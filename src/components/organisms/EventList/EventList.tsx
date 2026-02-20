"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useEvents, useCreateEvent } from "@/hooks/use-events";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/atoms/EmptyState";
import { EventCard } from "@/components/organisms/EventCard";
import { EventForm } from "@/components/molecules/EventForm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar } from "lucide-react";

export function EventList() {
  const { currentTeam, isCoach } = useAuthStore();
  const { data: events, isLoading } = useEvents(currentTeam?.id);
  const createEvent = useCreateEvent();
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
              Nieuw evenement
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Evenement aanmaken</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-4">
              <EventForm
                submitLabel="Evenement aanmaken"
                onSubmit={async (data) => {
                  if (!currentTeam) return;
                  await createEvent.mutateAsync({
                    team_id: currentTeam.id,
                    title: data.title,
                    description: data.description || null,
                    event_date: new Date(data.event_date).toISOString(),
                    end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
                    location: data.location || null,
                    notes: data.notes || null,
                  });
                  setCreateOpen(false);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {!events?.length ? (
        <EmptyState
          icon={Calendar}
          title="Geen evenementen"
          description="Er zijn nog geen evenementen gepland."
        />
      ) : (
        events.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            eventDate={event.event_date}
            location={event.location}
          />
        ))
      )}
    </div>
  );
}
