"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Users, Settings, Plus, ClipboardList, ChevronRight, Clock, Target, Trophy } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/atoms/Button";
import { TopPlayerCard } from "@/components/molecules/TopPlayerCard";
import { useTeamSeasonStats } from "@/hooks/use-player-stats";

function SeasonHighlights({ teamId }: { teamId: string }) {
  const { data: stats } = useTeamSeasonStats(teamId);

  if (!stats?.length) return null;

  const hasPlayed = stats.some((s) => s.matchesPlayed > 0);
  if (!hasPlayed) return null;

  const mostMinutes = stats.reduce((a, b) =>
    b.totalMinutes > a.totalMinutes ? b : a
  );
  const topScorer = stats.reduce((a, b) => (b.goals > a.goals ? b : a));
  const mostMatches = stats.reduce((a, b) =>
    b.matchesPlayed > a.matchesPlayed ? b : a
  );

  return (
    <div className="space-y-3 px-4 pb-4">
      <h2 className="text-sm font-medium text-muted-foreground">
        Seizoensoverzicht
      </h2>
      {mostMinutes.totalMinutes > 0 && (
        <TopPlayerCard
          title="Meeste minuten"
          playerName={mostMinutes.playerName}
          value={`${mostMinutes.totalMinutes} min`}
          icon={Clock}
        />
      )}
      {topScorer.goals > 0 && (
        <TopPlayerCard
          title="Topscorer"
          playerName={topScorer.playerName}
          value={`${topScorer.goals} ${topScorer.goals === 1 ? "goal" : "goals"}`}
          icon={Target}
        />
      )}
      {mostMatches.matchesPlayed > 0 && (
        <TopPlayerCard
          title="Meeste wedstrijden"
          playerName={mostMatches.playerName}
          value={`${mostMatches.matchesPlayed}`}
          icon={Trophy}
        />
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { currentTeam, isCoach, currentPlayer } = useAuthStore();

  if (!currentTeam) {
    return (
      <div className="flex flex-col items-center justify-center p-4 py-20">
        <Image
          src="/icons/icon-192x192.svg"
          alt="MyTeamPlanner logo"
          width={80}
          height={80}
          className="mx-auto mb-4 rounded-2xl"
        />
        <h1 className="text-2xl font-bold">Welkom bij MyTeamPlanner</h1>
        <p className="mt-2 text-center text-muted-foreground">
          Je hebt nog geen team. Maak er een aan om te beginnen.
        </p>
        <Link href="/create-team" className="mt-6">
          <Button className="gap-2">
            <Plus className="size-4" />
            Team aanmaken
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero header */}
      <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 px-4 pb-8 pt-6 text-white">
        <p className="text-sm font-medium text-white/60">
          {isCoach ? "Coach" : currentPlayer?.name ?? "Speler"}
        </p>
        <h1 className="mt-0.5 text-2xl font-bold">{currentTeam.name}</h1>
        {currentTeam.club_name && (
          <p className="mt-0.5 text-sm text-white/70">{currentTeam.club_name}</p>
        )}
      </div>

      {/* Quick action cards */}
      <div className="-mt-4 grid gap-3 px-4 pb-4">
        <Link href="/matches">
          <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-md transition-shadow hover:shadow-lg">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-100">
              <Calendar className="size-6 text-primary-700" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-neutral-900">Wedstrijden</h3>
              <p className="text-sm text-muted-foreground">
                Bekijk het wedstrijdprogramma
              </p>
            </div>
            <ChevronRight className="size-5 text-neutral-400" />
          </div>
        </Link>

        <Link href="/trainingen">
          <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-md transition-shadow hover:shadow-lg">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-warning-100">
              <ClipboardList className="size-6 text-warning-700" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-neutral-900">Training</h3>
              <p className="text-sm text-muted-foreground">
                Trainingsplannen en evenementen
              </p>
            </div>
            <ChevronRight className="size-5 text-neutral-400" />
          </div>
        </Link>

        <Link href="/team">
          <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-md transition-shadow hover:shadow-lg">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-100">
              <Users className="size-6 text-primary-700" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-neutral-900">Teamoverzicht</h3>
              <p className="text-sm text-muted-foreground">
                Bekijk alle spelers
              </p>
            </div>
            <ChevronRight className="size-5 text-neutral-400" />
          </div>
        </Link>

        {isCoach && (
          <Link href="/team/settings">
            <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-md transition-shadow hover:shadow-lg">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                <Settings className="size-6 text-neutral-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-neutral-900">Instellingen</h3>
                <p className="text-sm text-muted-foreground">
                  Teaminstellingen en uitnodigingslink
                </p>
              </div>
              <ChevronRight className="size-5 text-neutral-400" />
            </div>
          </Link>
        )}
      </div>

      <SeasonHighlights teamId={currentTeam.id} />
    </div>
  );
}
