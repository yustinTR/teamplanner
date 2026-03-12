import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { EventDetailClient } from "./client";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("title")
    .eq("id", id)
    .single();

  return {
    title: event?.title ?? "Event",
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  return <EventDetailClient eventId={id} />;
}
