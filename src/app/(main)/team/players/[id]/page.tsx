import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PlayerDetailClient } from "./client";

interface PlayerPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: player } = await supabase.from("players").select("name").eq("id", id).single();
  return {
    title: player?.name ?? "Speler",
  };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;
  return <PlayerDetailClient playerId={id} />;
}
