import type { Metadata } from "next";
import { LoginForm } from "@/components/molecules/LoginForm";

export const metadata: Metadata = {
  title: "Inloggen",
  description:
    "Log in bij je team op MyTeamPlanner. Beheer wedstrijden, beschikbaarheid en opstellingen.",
  alternates: {
    canonical: "https://myteamplanner.nl/login",
  },
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  return <LoginForm next={next} />;
}
