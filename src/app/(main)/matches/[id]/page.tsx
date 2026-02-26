"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, MapPin, Clock, XCircle, CheckCircle, ClipboardList, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { useMatch, useUpdateMatch, useCancelMatch } from "@/hooks/use-matches";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Spinner } from "@/components/atoms/Spinner";
import { MatchStatusBadge } from "@/components/molecules/MatchStatusBadge";
import { MatchScore } from "@/components/molecules/MatchScore";
import { MatchForm } from "@/components/molecules/MatchForm";
import { MyAvailability } from "@/components/organisms/MyAvailability";
import { AvailabilityGrid } from "@/components/organisms/AvailabilityGrid";
import { MatchPlayerForm } from "@/components/molecules/MatchPlayerForm";
import { MatchPlayerChip } from "@/components/molecules/MatchPlayerChip";
import { MatchStatsEditor } from "@/components/organisms/MatchStatsEditor";
import { OnboardingHint } from "@/components/molecules/OnboardingHint";
import { useMatchPlayers, useCreateMatchPlayer, useDeleteMatchPlayer } from "@/hooks/use-match-players";
import { formatMatchDate, calculateGatheringTime, formatTime } from "@/lib/utils";
import { HOME_AWAY_LABELS } from "@/lib/constants";
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

interface MatchDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MatchDetailPage({ params }: MatchDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { isCoach, currentTeam } = useAuthStore();
  const { data: match, isLoading } = useMatch(id);
  const updateMatch = useUpdateMatch();
  const cancelMatch = useCancelMatch();
  const { data: matchPlayers } = useMatchPlayers(id);
  const createMatchPlayer = useCreateMatchPlayer();
  const deleteMatchPlayer = useDeleteMatchPlayer();
  const [editOpen, setEditOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [scoreHome, setScoreHome] = useState(0);
  const [scoreAway, setScoreAway] = useState(0);
  const [leenOpen, setLeenOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">Wedstrijd niet gevonden.</p>
      </div>
    );
  }

  const defaultGatheringMinutes = currentTeam?.default_gathering_minutes ?? 60;
  const gatheringTime = match.gathering_time
    ? new Date(match.gathering_time)
    : calculateGatheringTime(
        match.match_date,
        defaultGatheringMinutes,
        match.travel_time_minutes,
      );
  const isUpcoming = match.status === "upcoming";

  return (
    <div>
      {/* Header with match info */}
      <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 px-4 pb-8 pt-4 text-white">
        <button
          onClick={() => router.back()}
          className="mb-3 flex items-center gap-1 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Terug
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">{match.opponent}</h1>
            <span className="text-sm text-white/70">
              {HOME_AWAY_LABELS[match.home_away]}
            </span>
          </div>
          <MatchStatusBadge status={match.status} />
        </div>

        {match.status === "completed" && (
          <div className="mt-2">
            <MatchScore
              scoreHome={match.score_home}
              scoreAway={match.score_away}
            />
          </div>
        )}

        <div className="mt-3 space-y-1 text-sm text-white/80">
          <p className="flex items-center gap-2">
            <Clock className="size-4" />
            {formatMatchDate(match.match_date)}
          </p>
          {isUpcoming && (
            <p className="flex items-center gap-2">
              <Users className="size-4" />
              Verzamelen: {formatTime(gatheringTime)}
              {match.home_away === "away" && match.travel_time_minutes
                ? ` (incl. ${match.travel_time_minutes} min reistijd)`
                : null}
            </p>
          )}
          {match.location && (
            <p className="flex items-center gap-2">
              <MapPin className="size-4" />
              {match.location}
            </p>
          )}
        </div>

        {match.notes && (
          <p className="mt-2 text-sm text-white/70">{match.notes}</p>
        )}
      </div>

      <div className="-mt-4 space-y-4 px-4 pb-4">
        {match.status === "upcoming" && (
          <div className="rounded-xl bg-white p-4 shadow-md">
            <MyAvailability matchId={match.id} />
          </div>
        )}

        {isCoach && (
          <OnboardingHint
            hintKey="availability_grid"
            title="Beschikbaarheid"
            description="Spelers kunnen hun beschikbaarheid doorgeven via de app. Deel de uitnodigingslink zodat ze zelf kunnen reageren."
            icon={Users}
          />
        )}

        <div className="rounded-xl bg-white p-4 shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Beschikbaarheid</h2>
            <Link href={`/matches/${match.id}/lineup`}>
              <Button variant="ghost" size="sm" className="gap-1">
                <ClipboardList className="size-4" />
                Opstelling
              </Button>
            </Link>
          </div>
          <AvailabilityGrid matchId={match.id} />
        </div>

        {match.status === "completed" && isCoach && (
          <div className="rounded-xl bg-white p-4 shadow-md">
            <OnboardingHint
              hintKey="match_stats"
              title="Statistieken invullen"
              description="Vul doelpunten en assists in bij de wedstrijdstatistieken om spelerdata op te bouwen."
            />
            <h2 className="mb-3 text-lg font-semibold">
              Wedstrijdstatistieken
            </h2>
            <MatchStatsEditor matchId={match.id} />
          </div>
        )}

        {/* Leen-spelers section */}
        {match.status === "upcoming" && (
          <div className="rounded-xl bg-white p-4 shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Leen-spelers</h2>
              {isCoach && (
                <Sheet open={leenOpen} onOpenChange={setLeenOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <UserPlus className="size-4" />
                      Toevoegen
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Leen-speler toevoegen</SheetTitle>
                    </SheetHeader>
                    <div className="px-4 pb-4">
                      <MatchPlayerForm
                        onSubmit={async (data) => {
                          await createMatchPlayer.mutateAsync({
                            match_id: match.id,
                            name: data.name,
                            primary_position: data.primary_position,
                          });
                          setLeenOpen(false);
                        }}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
            {matchPlayers && matchPlayers.length > 0 ? (
              <div className="space-y-2">
                {matchPlayers.map((mp) => (
                  <MatchPlayerChip
                    key={mp.id}
                    name={mp.name}
                    position={mp.primary_position}
                    onDelete={
                      isCoach
                        ? () => deleteMatchPlayer.mutate({ id: mp.id, matchId: match.id })
                        : undefined
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Geen leen-spelers.</p>
            )}
          </div>
        )}

        {isCoach && match.status === "upcoming" && (
          <div className="flex gap-2">
            <Sheet open={editOpen} onOpenChange={setEditOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex-1 gap-2">
                  <Pencil className="size-4" />
                  Bewerken
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Wedstrijd bewerken</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-4">
                  <MatchForm
                    defaultValues={{
                      opponent: match.opponent,
                      match_date: match.match_date,
                      location: match.location,
                      home_away: match.home_away,
                      notes: match.notes,
                      gathering_time: match.gathering_time,
                      travel_time_minutes: match.travel_time_minutes,
                    }}
                    defaultGatheringMinutes={defaultGatheringMinutes}
                    homeAddress={currentTeam?.home_address}
                    onSubmit={async (data) => {
                      await updateMatch.mutateAsync({ id: match.id, ...data });
                      setEditOpen(false);
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <Dialog open={completeOpen} onOpenChange={(open) => {
              setCompleteOpen(open);
              if (!open) { setScoreHome(0); setScoreAway(0); }
            }}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CheckCircle className="size-4" />
                  Afronden
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Wedstrijd afronden</DialogTitle>
                  <DialogDescription>
                    Vul de eindstand in om de wedstrijd als gespeeld te markeren.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-end gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-sm font-medium">
                      {match.home_away === "home" ? currentTeam?.name ?? "Thuis" : match.opponent}
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={scoreHome}
                      onChange={(e) => setScoreHome(Number(e.target.value))}
                    />
                  </div>
                  <span className="pb-2 text-lg font-bold text-muted-foreground">–</span>
                  <div className="flex-1 space-y-1">
                    <label className="text-sm font-medium">
                      {match.home_away === "away" ? currentTeam?.name ?? "Uit" : match.opponent}
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={scoreAway}
                      onChange={(e) => setScoreAway(Number(e.target.value))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCompleteOpen(false)}>
                    Annuleren
                  </Button>
                  <Button
                    onClick={async () => {
                      await updateMatch.mutateAsync({
                        id: match.id,
                        status: "completed",
                        score_home: scoreHome,
                        score_away: scoreAway,
                      });
                      setCompleteOpen(false);
                    }}
                  >
                    Afronden
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <XCircle className="size-4" />
                  Afgelasten
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Wedstrijd afgelasten</DialogTitle>
                  <DialogDescription>
                    Weet je zeker dat je de wedstrijd tegen {match.opponent} wilt
                    afgelasten?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCancelOpen(false)}>
                    Annuleren
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      await cancelMatch.mutateAsync(match.id);
                      setCancelOpen(false);
                    }}
                  >
                    Afgelasten
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
