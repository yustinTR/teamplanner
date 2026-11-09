import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardList, Repeat, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Gezien in de groepsapp? Maak er zelf een",
  description:
    "Die opstelling of dat wisselschema is gemaakt met MyTeamPlanner. Maak je eigen versie gratis, zonder account, en deel hem met je team.",
  alternates: { canonical: "https://www.myteamplanner.nl/maak" },
  robots: { index: false, follow: true },
};

const options = [
  {
    href: "/tools/opstelling",
    icon: ClipboardList,
    title: "Opstelling maken",
    body: "Formatie kiezen, namen invullen, delen als afbeelding. Zonder account.",
  },
  {
    href: "/tools/wisselschema",
    icon: Repeat,
    title: "Wisselschema maken",
    body: "Eerlijke speeltijd voor iedereen, met de minuten per speler erbij.",
  },
  {
    href: "/register",
    icon: Users,
    title: "Je hele team erin",
    body: "Beschikbaarheid, wedstrijden, opstellingen en statistieken op één plek. Gratis.",
  },
];

/** Landing page printed on every share image ("myteamplanner.nl/maak"). */
export default function MakeYourOwnPage() {
  return (
    <main className="min-h-screen bg-white px-4 pb-16 pt-10">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold text-primary-700">Gezien in de groepsapp?</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
          Maak je eigen opstelling of wisselschema
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Het beeld dat je zag is gemaakt met MyTeamPlanner, de gratis app voor amateurvoetbal.
          Probeer het zelf in een minuut.
        </p>

        <div className="mt-8 grid gap-4">
          {options.map(({ href, icon: Icon, title, body }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-4 rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-neutral-900 group-hover:text-primary-700">{title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{body}</span>
              </span>
              <ArrowRight className="mt-1 size-4 shrink-0 text-neutral-400" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
