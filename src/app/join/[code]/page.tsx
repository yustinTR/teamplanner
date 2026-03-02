import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Shield, Users, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TEAM_TYPE_LABELS } from "@/lib/constants";

interface JoinPageProps {
  params: Promise<{ code: string }>;
}

interface TeamInfo {
  found: boolean;
  team_name?: string;
  club_name?: string;
  team_type?: string;
  coach_name?: string;
}

async function getTeamInfo(code: string): Promise<TeamInfo> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_team_by_invite_code", {
    invite_code_input: code,
  });
  return (data as unknown as TeamInfo) ?? { found: false };
}

export async function generateMetadata({ params }: JoinPageProps): Promise<Metadata> {
  const { code } = await params;
  const info = await getTeamInfo(code);

  const title = info.found
    ? `Word lid van ${info.team_name}!`
    : "Je bent uitgenodigd!";
  const description = info.found
    ? `${info.coach_name} nodigt je uit om lid te worden van ${info.team_name} op MyTeamPlanner. Meld je gratis aan en doe mee.`
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

  // Authenticated user → auto-join and redirect
  if (user) {
    const userName = user.user_metadata?.name ?? user.email ?? "Speler";

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

  // Unauthenticated user → show welcome landing page
  const info = await getTeamInfo(code);

  if (!info.found) {
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

  const teamTypeLabel = info.team_type ? TEAM_TYPE_LABELS[info.team_type] : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 p-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {/* Team icon */}
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary-50">
            <Shield className="size-8 text-primary-600" />
          </div>

          {/* Coach invitation */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {info.coach_name} nodigt je uit voor
          </p>

          {/* Team name */}
          <h1 className="mt-1 text-center text-2xl font-bold text-neutral-900">
            {info.team_name}
          </h1>

          {/* Team details */}
          <div className="mt-2 flex items-center justify-center gap-2">
            {info.club_name && (
              <span className="text-sm text-muted-foreground">{info.club_name}</span>
            )}
            {info.club_name && teamTypeLabel && (
              <span className="text-muted-foreground/40">·</span>
            )}
            {teamTypeLabel && (
              <span className="text-sm text-muted-foreground">{teamTypeLabel}</span>
            )}
          </div>

          {/* CTA */}
          <Link
            href={`/register?next=/join/${code}`}
            className="mt-8 flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 text-base font-semibold text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg"
          >
            Meld je gratis aan
            <ArrowRight className="size-5" />
          </Link>

          {/* Login link */}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Al een account?{" "}
            <Link
              href={`/login?next=/join/${code}`}
              className="font-medium text-primary-600 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-white/60">
          <Users className="size-4" />
          <span className="text-xs">MyTeamPlanner — Gratis voor je hele team</span>
        </div>
      </div>
    </main>
  );
}
