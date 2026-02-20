"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, Calendar, MapPin, FileText } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useEvent, useUpdateEvent, useDeleteEvent } from "@/hooks/use-events";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { EventForm } from "@/components/molecules/EventForm";
import { MyEventAttendance } from "@/components/organisms/MyEventAttendance";
import { EventAttendanceGrid } from "@/components/organisms/EventAttendanceGrid";
import { EventTaskList } from "@/components/organisms/EventTaskList";
import { formatMatchDate } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { isCoach } = useAuthStore();
  const { data: event, isLoading } = useEvent(id);
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">Evenement niet gevonden.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 px-4 pb-8 pt-4 text-white">
        <button
          onClick={() => router.back()}
          className="mb-3 flex items-center gap-1 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Terug
        </button>

        <h1 className="text-xl font-bold">{event.title}</h1>

        {event.description && (
          <p className="mt-1 text-sm text-white/70">{event.description}</p>
        )}

        <div className="mt-3 space-y-1 text-sm text-white/80">
          <p className="flex items-center gap-2">
            <Calendar className="size-4" />
            {formatMatchDate(event.event_date)}
            {event.end_date && (
              <> &ndash; {formatMatchDate(event.end_date)}</>
            )}
          </p>
          {event.location && (
            <p className="flex items-center gap-2">
              <MapPin className="size-4" />
              {event.location}
            </p>
          )}
        </div>

        {event.notes && (
          <p className="mt-2 flex items-start gap-2 text-sm text-white/70">
            <FileText className="mt-0.5 size-4 shrink-0" />
            {event.notes}
          </p>
        )}
      </div>

      <div className="-mt-4 space-y-4 px-4 pb-4">
        {/* My attendance */}
        <div className="rounded-xl bg-white p-4 shadow-md">
          <MyEventAttendance eventId={event.id} />
        </div>

        {/* Attendance grid */}
        <div className="rounded-xl bg-white p-4 shadow-md">
          <h2 className="mb-3 text-lg font-semibold">Aanwezigheid</h2>
          <EventAttendanceGrid eventId={event.id} />
        </div>

        {/* Tasks */}
        <div className="rounded-xl bg-white p-4 shadow-md">
          <h2 className="mb-3 text-lg font-semibold">Taken</h2>
          <EventTaskList eventId={event.id} />
        </div>

        {/* Coach actions */}
        {isCoach && (
          <div className="flex gap-2">
            <Sheet open={editOpen} onOpenChange={setEditOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex-1 gap-2">
                  <Pencil className="size-4" />
                  Bewerken
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Evenement bewerken</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-4">
                  <EventForm
                    defaultValues={{
                      title: event.title,
                      description: event.description ?? "",
                      event_date: event.event_date,
                      end_date: event.end_date ?? "",
                      location: event.location ?? "",
                      notes: event.notes ?? "",
                    }}
                    onSubmit={async (data) => {
                      await updateEvent.mutateAsync({
                        id: event.id,
                        title: data.title,
                        description: data.description || null,
                        event_date: new Date(data.event_date).toISOString(),
                        end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
                        location: data.location || null,
                        notes: data.notes || null,
                      });
                      setEditOpen(false);
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="size-4" />
                  Verwijderen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Evenement verwijderen</DialogTitle>
                  <DialogDescription>
                    Weet je zeker dat je &quot;{event.title}&quot; wilt verwijderen?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                    Annuleren
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      await deleteEvent.mutateAsync({
                        id: event.id,
                        teamId: event.team_id,
                      });
                      setDeleteOpen(false);
                      router.push("/events");
                    }}
                  >
                    Verwijderen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
