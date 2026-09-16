"use client";

import Link from "next/link";
import { BarChart3, Settings } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { PlayerList } from "@/components/organisms/PlayerList";
import { Button } from "@/components/atoms/Button";

export default function TeamPage() {
  const { currentTeam, isCoach } = useAuthStore();

  return (
    <div>
      <div className="flex items-center justify-between bg-gradient-to-r from-primary-800 to-primary-600 px-4 pb-6 pt-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Team</h1>
          {currentTeam && (
            <p className="text-sm text-white/70">{currentTeam.name}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Link href="/team/stats">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" aria-label="Teamstatistieken">
              <BarChart3 className="size-5" />
            </Button>
          </Link>
          {isCoach && (
            <Link href="/team/settings">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" aria-label="Teaminstellingen">
                <Settings className="size-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="px-4 pb-4">
        <PlayerList />
      </div>
    </div>
  );
}
