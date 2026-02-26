"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, UserMinus } from "lucide-react";
import { SkillsRadar } from "@/components/molecules/SkillsRadar";
import { SkillsEditor } from "@/components/molecules/SkillsEditor";
import type { PlayerSkills } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";
import { usePlayer, useUpdatePlayer, useDeactivatePlayer } from "@/hooks/use-players";
import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { PlayerForm } from "@/components/molecules/PlayerForm";
import { PlayerStatsSection } from "@/components/organisms/PlayerStatsSection";
import { DETAILED_POSITION_LABELS, ROLE_LABELS } from "@/lib/constants";
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

interface PlayerDetailProps {
  playerId: string;
}

export function PlayerDetail({ playerId }: PlayerDetailProps) {
  const router = useRouter();
  const { isCoach } = useAuthStore();
  const { data: player, isLoading } = usePlayer(playerId);
  const updatePlayer = useUpdatePlayer();
  const deactivatePlayer = useDeactivatePlayer();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">Speler niet gevonden.</p>
      </div>
    );
  }

  const isStaff = player.role === "staff";

  return (
    <div className="p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Terug
      </button>

      <div className="flex items-start gap-4">
        <Avatar src={player.photo_url} fallback={player.name} size="lg" />
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{player.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge
              variant="default"
              label={ROLE_LABELS[player.role] ?? player.role}
            />
            {!isStaff && player.primary_position && (
              <Badge
                variant="default"
                label={DETAILED_POSITION_LABELS[player.primary_position] ?? player.primary_position}
              />
            )}
            {player.jersey_number != null && (
              <span className="text-sm text-muted-foreground">
                #{player.jersey_number}
              </span>
            )}
          </div>
          {!isStaff && player.secondary_positions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {player.secondary_positions.map((pos) => (
                <Badge
                  key={pos}
                  variant="default"
                  label={DETAILED_POSITION_LABELS[pos] ?? pos}
                  className="opacity-70"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {player.notes && (
        <div className="mt-4">
          <h2 className="text-sm font-medium text-muted-foreground">Notities</h2>
          <p className="mt-1 text-sm">{player.notes}</p>
        </div>
      )}

      {!isStaff && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Vaardigheden
            </h2>
            {isCoach && (
              <Sheet open={skillsOpen} onOpenChange={setSkillsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Pencil className="mr-1 size-3.5" />
                    {Object.keys((player.skills as PlayerSkills) ?? {}).length > 0
                      ? "Bewerken"
                      : "Beoordelen"}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Vaardigheden beoordelen</SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-4">
                    <SkillsEditor
                      skills={(player.skills as PlayerSkills) ?? {}}
                      onSave={async (skills) => {
                        await updatePlayer.mutateAsync({
                          id: player.id,
                          skills: skills as unknown as typeof player.skills,
                        });
                        setSkillsOpen(false);
                      }}
                      isSaving={updatePlayer.isPending}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
          {Object.keys((player.skills as PlayerSkills) ?? {}).length > 0 ? (
            <SkillsRadar skills={(player.skills as PlayerSkills) ?? {}} />
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Nog geen vaardigheden beoordeeld.
            </p>
          )}
        </div>
      )}

      {!isStaff && (
        <div className="mt-4">
          <PlayerStatsSection
            playerId={player.id}
            teamId={player.team_id}
          />
        </div>
      )}

      {isCoach && (
        <div className="mt-6 flex gap-2">
          <Sheet open={editOpen} onOpenChange={setEditOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Pencil className="mr-2 size-4" />
                Bewerken
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Speler bewerken</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-4">
                <PlayerForm
                  defaultValues={{
                    name: player.name,
                    primary_position: player.primary_position,
                    secondary_positions: player.secondary_positions,
                    role: player.role,
                    jersey_number: player.jersey_number,
                    notes: player.notes,
                  }}
                  onSubmit={async (data) => {
                    await updatePlayer.mutateAsync({ id: player.id, ...data });
                    setEditOpen(false);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <UserMinus className="mr-2 size-4" />
                Deactiveren
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Speler deactiveren</DialogTitle>
                <DialogDescription>
                  Weet je zeker dat je {player.name} wilt deactiveren? De speler
                  wordt niet verwijderd maar is niet meer zichtbaar in het team.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                  Annuleren
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    await deactivatePlayer.mutateAsync(player.id);
                    setDeleteOpen(false);
                    router.push("/team");
                  }}
                >
                  Deactiveren
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
