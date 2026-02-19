"use client";

import Link from "next/link";
import { Calendar, Users, Settings, Plus } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";

export default function DashboardPage() {
  const { currentTeam, isCoach, currentPlayer } = useAuthStore();

  if (!currentTeam) {
    return (
      <div className="flex flex-col items-center justify-center p-4 py-20">
        <h1 className="text-2xl font-semibold">Welkom bij TeamPlanner</h1>
        <p className="mt-2 text-muted-foreground">
          Je hebt nog geen team. Maak er een aan om te beginnen.
        </p>
        <Link href="/create-team" className="mt-4">
          <Button>
            <Plus className="mr-2 size-4" />
            Team aanmaken
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{currentTeam.name}</h1>
        {currentTeam.club_name && (
          <p className="text-sm text-muted-foreground">{currentTeam.club_name}</p>
        )}
        <p className="mt-1 text-sm text-muted-foreground">
          {isCoach ? "Coach" : currentPlayer?.name ?? "Speler"}
        </p>
      </div>

      <div className="grid gap-4">
        <Link href="/matches">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="size-5 text-primary" />
                Wedstrijden
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Bekijk het wedstrijdprogramma
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/team">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-5 text-primary" />
                Teamoverzicht
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Bekijk alle spelers
              </p>
            </CardContent>
          </Card>
        </Link>

        {isCoach && (
          <Link href="/team/settings">
            <Card className="hover:bg-accent/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="size-5 text-primary" />
                  Instellingen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Teaminstellingen en uitnodigingslink
                </p>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
