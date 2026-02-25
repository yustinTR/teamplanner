"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Plus, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useMatches, useCreateMatch, useRefreshMatches } from "@/hooks/use-matches";
import { MatchCard } from "@/components/organisms/MatchCard";
import { Button } from "@/components/atoms/Button";
import { EmptyState } from "@/components/atoms/EmptyState";
import { Spinner } from "@/components/atoms/Spinner";
import { MatchForm } from "@/components/molecules/MatchForm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Match } from "@/types";

function groupByMonth(matches: Match[]): Record<string, Match[]> {
  const groups: Record<string, Match[]> = {};
  for (const match of matches) {
    const date = new Date(match.match_date);
    const key = date.toLocaleDateString("nl-NL", { month: "long", year: "numeric" });
    if (!groups[key]) groups[key] = [];
    groups[key].push(match);
  }
  return groups;
}

export function MatchList() {
  const router = useRouter();
  const { currentTeam, isCoach } = useAuthStore();
  const { data: matches, isLoading } = useMatches(currentTeam?.id);
  const createMatch = useCreateMatch();
  const refreshMatches = useRefreshMatches();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [refreshResult, setRefreshResult] = useState<{
    matchesCreated: number;
    matchesUpdated: number;
    errors: string[];
  } | null>(null);

  const hasImportSource = !!currentTeam?.import_club_abbrev;

  async function handleRefresh() {
    if (!currentTeam) return;
    setRefreshResult(null);
    try {
      const result = await refreshMatches.mutateAsync(currentTeam.id);
      setRefreshResult(result);
      // Auto-hide result after 5 seconds
      setTimeout(() => setRefreshResult(null), 5000);
    } catch {
      // Error is handled by the mutation
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const matchFormProps = {
    defaultGatheringMinutes: currentTeam?.default_gathering_minutes,
    homeAddress: currentTeam?.home_address,
  };

  if (!matches?.length) {
    return (
      <EmptyState
        icon={Calendar}
        title="Geen wedstrijden"
        description="Plan je eerste wedstrijd om te beginnen."
        action={
          isCoach ? (
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button>
                  <Plus className="mr-2 size-4" />
                  Wedstrijd toevoegen
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Wedstrijd toevoegen</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-4">
                  <MatchForm
                    {...matchFormProps}
                    submitLabel="Toevoegen"
                    onSubmit={async (data) => {
                      if (!currentTeam) return;
                      await createMatch.mutateAsync({
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

  // Sort: upcoming first, then by date
  const now = new Date().toISOString();
  const upcoming = matches.filter(
    (m) => m.status === "upcoming" && m.match_date >= now
  );
  const past = matches.filter(
    (m) => m.status !== "upcoming" || m.match_date < now
  );
  past.reverse();

  const sortedMatches = [...upcoming, ...past];
  const grouped = groupByMonth(sortedMatches);

  return (
    <div>
      {refreshResult && (
        <div className="mb-4 rounded-lg bg-success/10 p-3 text-sm text-success">
          {refreshResult.matchesCreated > 0 &&
            `${refreshResult.matchesCreated} nieuwe wedstrijden. `}
          {refreshResult.matchesUpdated > 0 &&
            `${refreshResult.matchesUpdated} wedstrijden bijgewerkt. `}
          {refreshResult.matchesCreated === 0 &&
            refreshResult.matchesUpdated === 0 &&
            "Alles is al up-to-date."}
        </div>
      )}
      {refreshMatches.isError && (
        <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
          {refreshMatches.error instanceof Error
            ? refreshMatches.error.message
            : "Er is een fout opgetreden bij het vernieuwen."}
        </div>
      )}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {matches.length} {matches.length === 1 ? "wedstrijd" : "wedstrijden"}
        </p>
        {isCoach && (
          <div className="flex gap-2">
            {hasImportSource && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshMatches.isPending}
              >
                <RefreshCw
                  className={`mr-1 size-4 ${refreshMatches.isPending ? "animate-spin" : ""}`}
                />
                {refreshMatches.isPending ? "Vernieuwen..." : "Vernieuwen"}
              </Button>
            )}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-1 size-4" />
                  Toevoegen
                </Button>
              </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Wedstrijd toevoegen</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-4">
                <MatchForm
                  {...matchFormProps}
                  submitLabel="Toevoegen"
                  onSubmit={async (data) => {
                    if (!currentTeam) return;
                    await createMatch.mutateAsync({
                      ...data,
                      team_id: currentTeam.id,
                    });
                    setSheetOpen(false);
                  }}
                />
              </div>
            </SheetContent>
            </Sheet>
          </div>
        )}
      </div>

      {Object.entries(grouped).map(([month, monthMatches]) => (
        <div key={month} className="mb-6">
          <h2 className="mb-2 text-sm font-medium capitalize text-muted-foreground">
            {month}
          </h2>
          <div className="space-y-2">
            {monthMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                defaultGatheringMinutes={currentTeam?.default_gathering_minutes ?? 60}
                onClick={() => router.push(`/matches/${match.id}`)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
