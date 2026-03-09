import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nieuw wachtwoord instellen",
  description: "Stel een nieuw wachtwoord in voor je MyTeamPlanner account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
