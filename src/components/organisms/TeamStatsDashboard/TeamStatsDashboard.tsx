"use client";

import { BarChart3 } from "lucide-react";
import { useTeamStats } from "@/hooks/use-team-stats";
import { MinutesFairnessChart } from "@/components/molecules/MinutesFairnessChart";
import { TopScorersList } from "@/components/molecules/TopScorersList";
import { AttendanceOverview } from "@/components/molecules/AttendanceOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { EmptyState } from "@/components/atoms/EmptyState";
import { Spinner } from "@/components/atoms/Spinner";

interface TeamStatsDashboardProps {
  teamId: string;
}

interface StatTileProps {
  label: string;
  value: string;
}

function StatTile({ label, value }: StatTileProps) {
  return (
    <div className="rounded-xl border border-neutral-100 bg-white p-3 text-center shadow-sm">
      <div className="text-xl font-bold text-neutral-900">{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export function TeamStatsDashboard({ teamId }: TeamStatsDashboardProps) {
  const { data, isLoading } = useTeamStats(teamId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!data || data.summary.played === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Nog geen statistieken"
        description="Statistieken verschijnen zodra je eerste wedstrijd is gespeeld en de uitslag is ingevuld."
      />
    );
  }

  const { summary, playerStats, attendance } = data;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <StatTile label="Gespeeld" value={`${summary.played}`} />
        <StatTile
          label="W-G-V"
          value={`${summary.wins}-${summary.draws}-${summary.losses}`}
        />
        <StatTile label="Voor" value={`${summary.goalsFor}`} />
        <StatTile label="Tegen" value={`${summary.goalsAgainst}`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Speeltijd</CardTitle>
        </CardHeader>
        <CardContent>
          <MinutesFairnessChart stats={playerStats} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Topscorers</CardTitle>
        </CardHeader>
        <CardContent>
          <TopScorersList stats={playerStats} statKey="goals" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assists</CardTitle>
        </CardHeader>
        <CardContent>
          <TopScorersList stats={playerStats} statKey="assists" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aanwezigheid</CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceOverview attendance={attendance} />
        </CardContent>
      </Card>
    </div>
  );
}
