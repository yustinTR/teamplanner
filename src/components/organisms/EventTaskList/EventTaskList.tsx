"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { usePlayers } from "@/hooks/use-players";
import { useEventTasks, useCreateEventTask, useUpdateEventTask } from "@/hooks/use-event-tasks";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { EventTaskItem } from "@/components/molecules/EventTaskItem";
import { EventTaskForm } from "@/components/molecules/EventTaskForm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface EventTaskListProps {
  eventId: string;
}

export function EventTaskList({ eventId }: EventTaskListProps) {
  const { currentTeam, currentPlayer, isCoach } = useAuthStore();
  const { data: tasks, isLoading } = useEventTasks(eventId);
  const { data: players } = usePlayers(currentTeam?.id);
  const createTask = useCreateEventTask();
  const updateTask = useUpdateEventTask();
  const [addOpen, setAddOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {isCoach && (
        <Sheet open={addOpen} onOpenChange={setAddOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plus className="size-4" />
              Taak toevoegen
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Taak toevoegen</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-4">
              <EventTaskForm
                players={players ?? []}
                onSubmit={async (data) => {
                  await createTask.mutateAsync({
                    event_id: eventId,
                    title: data.title,
                    description: data.description || null,
                    assigned_to: data.assigned_to,
                    deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
                  });
                  setAddOpen(false);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {tasks && tasks.length > 0 ? (
        tasks.map((task) => {
          const assignedPlayer = task.players as unknown as { id: string; name: string } | null;
          return (
            <EventTaskItem
              key={task.id}
              title={task.title}
              description={task.description}
              assignedTo={assignedPlayer?.name}
              deadline={task.deadline}
              isDone={task.is_done}
              onToggleDone={
                isCoach
                  ? () =>
                      updateTask.mutate({
                        id: task.id,
                        eventId,
                        is_done: !task.is_done,
                      })
                  : undefined
              }
              canClaim={!isCoach && !!currentPlayer}
              onClaim={
                currentPlayer
                  ? () =>
                      updateTask.mutate({
                        id: task.id,
                        eventId,
                        assigned_to: currentPlayer.id,
                      })
                  : undefined
              }
            />
          );
        })
      ) : (
        <p className="text-sm text-muted-foreground">Geen taken.</p>
      )}
    </div>
  );
}
