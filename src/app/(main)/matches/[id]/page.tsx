"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, MapPin, Clock, XCircle, ClipboardList } from "lucide-react";
import Link from "next/link";
import { useMatch, useUpdateMatch, useCancelMatch } from "@/hooks/use-matches";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent } from "@/components/atoms/Card";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { MatchStatusBadge } from "@/components/molecules/MatchStatusBadge";
import { MatchScore } from "@/components/molecules/MatchScore";
import { MatchForm } from "@/components/molecules/MatchForm";
import { MyAvailability } from "@/components/organisms/MyAvailability";
import { AvailabilityGrid } from "@/components/organisms/AvailabilityGrid";
import { formatMatchDate } from "@/lib/utils";
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
  const { isCoach } = useAuthStore();
  const { data: match, isLoading } = useMatch(id);
  const updateMatch = useUpdateMatch();
  const cancelMatch = useCancelMatch();
  const [editOpen, setEditOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

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

  return (
    <div className="p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Terug
      </button>

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold">{match.opponent}</h1>
              <span className="text-sm text-muted-foreground">
                {HOME_AWAY_LABELS[match.home_away]}
              </span>
            </div>
            <MatchStatusBadge status={match.status} />
          </div>

          {match.status === "completed" && (
            <MatchScore
              scoreHome={match.score_home}
              scoreAway={match.score_away}
            />
          )}

          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Clock className="size-4" />
              {formatMatchDate(match.match_date)}
            </p>
            {match.location && (
              <p className="flex items-center gap-2">
                <MapPin className="size-4" />
                {match.location}
              </p>
            )}
          </div>

          {match.notes && (
            <p className="text-sm">{match.notes}</p>
          )}
        </CardContent>
      </Card>

      {match.status === "upcoming" && (
        <div className="mt-6">
          <MyAvailability matchId={match.id} />
        </div>
      )}

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Beschikbaarheid</h2>
          <Link href={`/matches/${match.id}/lineup`}>
            <Button variant="ghost" size="sm">
              <ClipboardList className="mr-1 size-4" />
              Opstelling
            </Button>
          </Link>
        </div>
        <AvailabilityGrid matchId={match.id} />
      </div>

      {isCoach && match.status === "upcoming" && (
        <div className="mt-4 flex gap-2">
          <Sheet open={editOpen} onOpenChange={setEditOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Pencil className="mr-2 size-4" />
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
                  }}
                  onSubmit={async (data) => {
                    await updateMatch.mutateAsync({ id: match.id, ...data });
                    setEditOpen(false);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <XCircle className="mr-2 size-4" />
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
  );
}
