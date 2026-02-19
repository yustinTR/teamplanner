"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { LineupField } from "@/components/organisms/LineupField";
import { LineupView } from "@/components/organisms/LineupView";

interface LineupPageProps {
  params: Promise<{ id: string }>;
}

export default function LineupPage({ params }: LineupPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { isCoach } = useAuthStore();

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

      {isCoach ? (
        <LineupField matchId={id} />
      ) : (
        <LineupView matchId={id} />
      )}
    </div>
  );
}
