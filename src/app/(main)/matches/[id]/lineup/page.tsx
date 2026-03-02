"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useMatch } from "@/hooks/use-matches";
import { LineupField } from "@/components/organisms/LineupField";
import { LineupView } from "@/components/organisms/LineupView";
import { OnboardingHint } from "@/components/molecules/OnboardingHint";

interface LineupPageProps {
  params: Promise<{ id: string }>;
}

export default function LineupPage({ params }: LineupPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { isCoach } = useAuthStore();
  const { data: match } = useMatch(id);

  return (
    <div className="p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Terug
      </button>

      <h1 className="mb-4 text-2xl font-semibold">Opstelling</h1>

      {isCoach && (
        <div className="mb-4">
          <OnboardingHint
            hintKey="lineup_editor"
            title="Opstelling maken"
            description="Sleep spelers naar het veld om je opstelling te maken. Kies eerst een formatie rechtsboven."
          />
        </div>
      )}

      {isCoach ? (
        <LineupField
          matchId={id}
          matchOpponent={match?.opponent}
          matchDate={match?.match_date}
        />
      ) : (
        <LineupView
          matchId={id}
          matchOpponent={match?.opponent}
          matchDate={match?.match_date}
        />
      )}
    </div>
  );
}
