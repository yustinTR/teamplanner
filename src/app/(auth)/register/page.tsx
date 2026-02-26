import type { Metadata } from "next";
import { RegisterForm } from "@/components/molecules/RegisterForm";

export const metadata: Metadata = {
  title: "Gratis account aanmaken",
  description:
    "Maak gratis een account aan op MyTeamPlanner en begin direct met het beheren van je amateurvoetbalteam.",
  alternates: {
    canonical: "https://myteamplanner.nl/register",
  },
};

interface RegisterPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { next } = await searchParams;
  return <RegisterForm next={next} />;
}
