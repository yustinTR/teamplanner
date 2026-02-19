"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { PlayerList } from "@/components/organisms/PlayerList";
import { Button } from "@/components/atoms/Button";

export default function TeamPage() {
  const { currentTeam, isCoach } = useAuthStore();

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Team</h1>
          {currentTeam && (
            <p className="text-sm text-muted-foreground">{currentTeam.name}</p>
          )}
        </div>
        {isCoach && (
          <Link href="/team/settings">
            <Button variant="ghost" size="icon">
              <Settings className="size-5" />
            </Button>
          </Link>
        )}
      </div>

      <PlayerList />
    </div>
  );
}
