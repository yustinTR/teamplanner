"use client";

import { useRef, useState } from "react";
import { BarChart3, Share2 } from "lucide-react";
import { useTeamStats } from "@/hooks/use-team-stats";
import { SeasonSelect } from "@/components/molecules/SeasonSelect";
import { currentSeason, seasonLabel } from "@/lib/season";
import { MinutesFairnessChart } from "@/components/molecules/MinutesFairnessChart";
import { TopScorersList } from "@/components/molecules/TopScorersList";
import { AttendanceOverview } from "@/components/molecules/AttendanceOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { EmptyState } from "@/components/atoms/EmptyState";
import { Spinner } from "@/components/atoms/Spinner";
import { Button } from "@/components/atoms/Button";
import { ShareSeasonReview } from "@/components/molecules/ShareSeasonReview";
import { useShareImage } from "@/hooks/use-share-image";
import { useAuthStore } from "@/stores/auth-store";
import { buildSeasonReview } from "@/lib/season-review";

/** "tot de winterstop" in December and January, otherwise "tot nu toe". */
function seasonSubtitle(season: number, now = new Date()): string | undefined {
  if (season !== currentSeason(now)) return undefined;
  const month = now.getMonth();
  return month === 11 || month === 0 ? "tot de winterstop" : "tot nu toe";
}

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
  const [season, setSeason] = useState(() => currentSeason());
  const { data, isLoading } = useTeamStats(teamId, season);
  const teamName = useAuthStore((s) => s.currentTeam?.name) ?? "Mijn team";
  const cardRef = useRef<HTMLDivElement>(null);
  const { share, isGenerating } = useShareImage();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  const seasons = data?.seasons ?? [season];
  const selector = seasons.length > 1 && (
    <SeasonSelect seasons={seasons} value={season} onChange={setSeason} />
  );

  if (!data || data.summary.played === 0) {
    return (
      <div className="space-y-4">
        {selector}
        <EmptyState
          icon={BarChart3}
          title={`Nog geen statistieken in seizoen ${seasonLabel(season)}`}
          description="Statistieken verschijnen zodra de eerste wedstrijd van dit seizoen is gespeeld en de uitslag is ingevuld."
        />
      </div>
    );
  }

  const { summary, playerStats, attendance } = data;
  const review = buildSeasonReview(summary, playerStats, attendance);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>{selector}</div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          disabled={isGenerating}
          onClick={() =>
            cardRef.current &&
            share(cardRef.current, `seizoen-${seasonLabel(season).replace("/", "-")}`, "share_season_review")
          }
        >
          <Share2 className="size-4" />
          {isGenerating ? "Genereren..." : "Seizoenskaart delen"}
        </Button>
      </div>
      {/* Off-screen card for html2canvas */}
      <div aria-hidden="true" className="pointer-events-none fixed -left-[9999px] top-0">
        <div ref={cardRef}>
          <ShareSeasonReview
            teamName={teamName}
            seasonLabel={seasonLabel(season)}
            subtitle={seasonSubtitle(season)}
            review={review}
          />
        </div>
      </div>
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
