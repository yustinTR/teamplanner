"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { TeamStatsDashboard } from "@/components/organisms/TeamStatsDashboard";
import { Button } from "@/components/atoms/Button";

export default function TeamStatsPage() {
  const { currentTeam } = useAuthStore();

  return (
    <div>
      <div className="flex items-center gap-2 bg-gradient-to-r from-primary-800 to-primary-600 px-4 pb-6 pt-5">
        <Link href="/team">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-white"
            aria-label="Terug naar team"
          >
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Statistieken</h1>
          {currentTeam && (
            <p className="text-sm text-white/70">{currentTeam.name}</p>
          )}
        </div>
      </div>

      <div className="px-4 py-4">
        {currentTeam ? (
          <TeamStatsDashboard teamId={currentTeam.id} />
        ) : null}
      </div>
    </div>
  );
}
