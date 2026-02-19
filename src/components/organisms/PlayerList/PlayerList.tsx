"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { usePlayers, useCreatePlayer } from "@/hooks/use-players";
import { PlayerChip } from "@/components/molecules/PlayerChip";
import { PlayerForm } from "@/components/molecules/PlayerForm";
import { Button } from "@/components/atoms/Button";
import { EmptyState } from "@/components/atoms/EmptyState";
import { Spinner } from "@/components/atoms/Spinner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function PlayerList() {
  const router = useRouter();
  const { currentTeam, isCoach } = useAuthStore();
  const { data: players, isLoading } = usePlayers(currentTeam?.id);
  const createPlayer = useCreatePlayer();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!players?.length) {
    return (
      <EmptyState
        icon={Users}
        title="Geen spelers"
        description="Voeg spelers toe aan je team om te beginnen."
        action={
          isCoach ? (
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button>
                  <Plus className="mr-2 size-4" />
                  Speler toevoegen
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Speler toevoegen</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-4">
                  <PlayerForm
                    submitLabel="Toevoegen"
                    onSubmit={async (data) => {
                      if (!currentTeam) return;
                      await createPlayer.mutateAsync({
                        ...data,
                        team_id: currentTeam.id,
                      });
                      setSheetOpen(false);
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>
          ) : undefined
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {players.length} {players.length === 1 ? "speler" : "spelers"}
        </p>
        {isCoach && (
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1 size-4" />
                Toevoegen
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Speler toevoegen</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-4">
                <PlayerForm
                  submitLabel="Toevoegen"
                  onSubmit={async (data) => {
                    if (!currentTeam) return;
                    await createPlayer.mutateAsync({
                      ...data,
                      team_id: currentTeam.id,
                    });
                    setSheetOpen(false);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      <div className="divide-y">
        {players.map((player) => (
          <PlayerChip
            key={player.id}
            name={player.name}
            photoUrl={player.photo_url}
            position={player.position}
            jerseyNumber={player.jersey_number}
            onClick={() => router.push(`/team/players/${player.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
