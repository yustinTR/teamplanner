import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wachtwoord vergeten",
  description:
    "Wachtwoord vergeten? Vraag een reset-link aan om je wachtwoord te herstellen.",
  alternates: {
    canonical: "https://myteamplanner.nl/forgot-password",
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
