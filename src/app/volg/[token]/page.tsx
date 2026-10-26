import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PublicTeamView } from "@/components/organisms/PublicTeamView";
import type { PublicTeamView as PublicTeamViewData } from "@/types/public-team";

interface FollowPageProps {
  params: Promise<{ token: string }>;
}

async function getView(token: string): Promise<PublicTeamViewData> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_public_team_view", { share_token_input: token });
  return (data as unknown as PublicTeamViewData) ?? { found: false };
}

export async function generateMetadata({ params }: FollowPageProps): Promise<Metadata> {
  const { token } = await params;
  const view = await getView(token);
  return {
    title: view.found ? `${view.team_name} · programma en opstellingen` : "Volglink",
    robots: { index: false, follow: false },
  };
}

/** Read-only page for parents and carers; opened through the coach's "volglink". */
export default async function FollowPage({ params }: FollowPageProps) {
  const { token } = await params;
  const view = await getView(token);

  if (!view.found) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-xl font-semibold">Deze link werkt niet meer</h1>
        <p className="text-sm text-muted-foreground">
          De coach heeft de volglink uitgezet of de link klopt niet. Vraag de coach om een nieuwe link.
        </p>
        <Link href="/" className="text-sm font-medium text-primary-600">
          Naar myteamplanner.nl
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <PublicTeamView
        teamName={view.team_name ?? "Team"}
        clubName={view.club_name}
        teamType={view.team_type}
        defaultGatheringMinutes={view.default_gathering_minutes ?? 60}
        matches={view.matches ?? []}
        now={new Date().toISOString()}
      />
      <footer className="pb-8 text-center text-xs text-muted-foreground">
        Gemaakt met{" "}
        <Link href="/" className="font-medium text-primary-600">
          MyTeamPlanner
        </Link>{" "}
        · gratis voor je team
      </footer>
    </div>
  );
}
