import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MatchDetailClient } from "./client";

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: match } = await supabase
    .from("matches")
    .select("opponent, match_date")
    .eq("id", id)
    .single();

  if (!match) return { title: "Wedstrijd" };

  const date = new Date(match.match_date).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
  });

  return {
    title: `vs ${match.opponent} · ${date}`,
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;
  return <MatchDetailClient matchId={id} />;
}
