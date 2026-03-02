import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface JoinPageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: JoinPageProps): Promise<Metadata> {
  const { code } = await params;
  const supabase = await createClient();

  // Try to fetch team name — may fail if RLS blocks anonymous access
  const { data: team } = await supabase
    .from("teams")
    .select("name")
    .eq("invite_code", code)
    .limit(1)
    .single();

  const teamName = team?.name;
  const title = teamName
    ? `Word lid van ${teamName}!`
    : "Je bent uitgenodigd!";
  const description = teamName
    ? `Je bent uitgenodigd om lid te worden van ${teamName} op MyTeamPlanner. Meld je gratis aan en doe mee.`
    : "Een teamgenoot heeft je uitgenodigd om mee te doen op MyTeamPlanner. Meld je gratis aan.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://myteamplanner.nl/join/${code}`,
      siteName: "MyTeamPlanner",
      images: [{ url: "/api/og", width: 1200, height: 630 }],
    },
    robots: { index: false, follow: false },
  };
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { code } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/register?next=/join/${code}`);
  }

  const userName = user.user_metadata?.name ?? user.email ?? "Speler";

  // Use SECURITY DEFINER RPC to bypass RLS for team lookup + player creation
  const { data, error } = await supabase.rpc("join_team_by_invite_code", {
    invite_code_input: code,
    user_name: userName,
  });

  const result = data as { success?: boolean; error?: string } | null;

  if (error || !result?.success) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Ongeldige link</h1>
          <p className="mt-2 text-muted-foreground">
            Deze uitnodigingslink is niet geldig.
          </p>
        </div>
      </main>
    );
  }

  redirect("/dashboard");
}
