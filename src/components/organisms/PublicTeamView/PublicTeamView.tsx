import { Clock, MapPin, Users } from "lucide-react";
import { PublicPitch } from "@/components/molecules/PublicPitch";
import { MatchScore } from "@/components/molecules/MatchScore";
import { calculateGatheringTime, formatMatchDate, formatTime } from "@/lib/utils";
import { HOME_AWAY_LABELS, TEAM_TYPE_LABELS } from "@/lib/constants";
import type { PublicMatch } from "@/types/public-team";

interface PublicTeamViewProps {
  teamName: string;
  clubName?: string | null;
  teamType?: string;
  defaultGatheringMinutes: number;
  matches: PublicMatch[];
  /** ISO timestamp used to split upcoming from past; passed in so rendering stays pure. */
  now: string;
}

/**
 * The read-only parent/carer page: programme plus published lineups.
 * Pure props, no hooks; the route fetches through the public RPC.
 */
export function PublicTeamView({
  teamName,
  clubName,
  teamType,
  defaultGatheringMinutes,
  matches,
  now,
}: PublicTeamViewProps) {
  const nowMs = new Date(now).getTime();
  const upcoming = matches.filter((m) => m.status === "upcoming" && new Date(m.match_date).getTime() >= nowMs - 3 * 3600 * 1000);
  const played = matches
    .filter((m) => m.status === "completed")
    .sort((a, b) => b.match_date.localeCompare(a.match_date))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-lg">
      <header className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 px-4 pb-8 pt-6 text-white">
        <p className="text-xs font-medium uppercase tracking-wider text-white/70">Programma en opstellingen</p>
        <h1 className="mt-1 text-2xl font-bold">{teamName}</h1>
        <p className="text-sm text-white/80">
          {[clubName, teamType ? TEAM_TYPE_LABELS[teamType as keyof typeof TEAM_TYPE_LABELS] : null]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>

      <main className="-mt-4 space-y-4 px-4 pb-8">
        {upcoming.length === 0 && (
          <div className="rounded-xl bg-white p-4 shadow-md">
            <p className="text-sm text-muted-foreground">Geen aankomende wedstrijden.</p>
          </div>
        )}

        {upcoming.map((match) => {
          const gathering = match.gathering_time
            ? new Date(match.gathering_time)
            : calculateGatheringTime(match.match_date, defaultGatheringMinutes, match.travel_time_minutes);
          return (
            <section key={match.id} className="rounded-xl bg-white p-4 shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold">{match.opponent}</h2>
                  <span className="text-xs font-medium text-primary-600">{HOME_AWAY_LABELS[match.home_away]}</span>
                </div>
              </div>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Clock className="size-4" />
                  {formatMatchDate(match.match_date)}
                </p>
                <p className="flex items-center gap-2">
                  <Users className="size-4" />
                  Verzamelen {formatTime(gathering)}
                </p>
                {match.location && (
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    {match.location}
                  </p>
                )}
              </div>
              {match.lineup && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium">Opstelling ({match.lineup.formation})</p>
                  <PublicPitch positions={match.lineup.positions} />
                </div>
              )}
            </section>
          );
        })}

        {played.length > 0 && (
          <section className="rounded-xl bg-white p-4 shadow-md">
            <h2 className="mb-2 text-lg font-semibold">Laatste uitslagen</h2>
            <ul className="divide-y">
              {played.map((match) => (
                <li key={match.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <p className="font-medium">{match.opponent}</p>
                    <p className="text-xs text-muted-foreground">
                      {HOME_AWAY_LABELS[match.home_away]} · {formatMatchDate(match.match_date)}
                    </p>
                  </div>
                  <MatchScore scoreHome={match.score_home} scoreAway={match.score_away} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
