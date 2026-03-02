"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Shield, User, Check } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { TEAM_TYPE_LABELS } from "@/lib/constants";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

function setTeamCookie(teamId: string) {
  document.cookie = `tp-last-team-id=${teamId};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

export function TeamSwitcher() {
  const { myTeams, currentTeam } = useAuthStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Only show when user has multiple teams
  if (myTeams.length <= 1) return null;

  function handleSelect(teamId: string) {
    if (teamId === currentTeam?.id) {
      setOpen(false);
      return;
    }
    setTeamCookie(teamId);
    setOpen(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-3 top-3 z-40 flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm transition-colors active:bg-white/30"
      >
        <ArrowLeftRight className="size-3" />
        <span>{currentTeam?.name}</span>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" showCloseButton={false} className="rounded-t-xl">
          <SheetHeader>
            <SheetTitle>Kies een team</SheetTitle>
            <SheetDescription>Wissel tussen je teams</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-1 px-4 pb-6">
            {myTeams.map(({ team, role }) => {
              const isActive = team.id === currentTeam?.id;
              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => handleSelect(team.id)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-neutral-100 active:bg-neutral-100"
                  }`}
                >
                  {role === "coach" ? (
                    <Shield className="size-5 shrink-0" />
                  ) : (
                    <User className="size-5 shrink-0" />
                  )}
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-semibold">{team.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {TEAM_TYPE_LABELS[team.team_type] ?? team.team_type}
                      {" · "}
                      {role === "coach" ? "Coach" : "Speler"}
                    </span>
                  </div>
                  {isActive && <Check className="size-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
