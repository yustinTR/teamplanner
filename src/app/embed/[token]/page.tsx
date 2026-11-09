import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TeamWidget } from "@/components/molecules/TeamWidget";
import type { PublicTeamView as PublicTeamViewData } from "@/types/public-team";

interface EmbedPageProps {
  params: Promise<{ token: string }>;
}

export const metadata: Metadata = {
  title: "Programma",
  robots: { index: false, follow: true },
};

/** Iframe target for club websites, keyed by the team's follow-link token. */
export default async function EmbedPage({ params }: EmbedPageProps) {
  const { token } = await params;
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_public_team_view", { share_token_input: token });
  const view = (data as unknown as PublicTeamViewData) ?? { found: false };

  if (!view.found) {
    return <p className="p-4 text-sm text-neutral-500">Dit programma is niet meer beschikbaar.</p>;
  }

  return (
    <div className="bg-transparent p-1">
      <TeamWidget
        teamName={view.team_name ?? "Team"}
        clubName={view.club_name}
        matches={view.matches ?? []}
        now={new Date().toISOString()}
      />
    </div>
  );
}
