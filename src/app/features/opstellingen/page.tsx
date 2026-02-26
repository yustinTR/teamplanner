import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Opstelling maken met drag & drop",
  description:
    "Maak visuele voetbalopstellingen met drag & drop. Kies een formatie, sleep spelers naar het veld en plan wisselmomenten met automatische speeltijdverdeling.",
  alternates: {
    canonical: "https://myteamplanner.nl/features/opstellingen",
  },
};

const solutions = [
  "Kies uit formaties voor 11v11 en 7v7 (ook voor jeugd en G-teams)",
  "Sleep spelers naar hun positie op het voetbalveld",
  "Plan wisselmomenten en zie automatisch hoeveel minuten elke speler speelt",
  "Eerlijke speeltijdverdeling over het seizoen — cruciaal bij jeugd en G-voetbal",
  "Spelers kunnen hun opstelling bekijken in de app",
];

const steps = [
  {
    step: "1",
    title: "Kies een formatie",
    description: "4-3-3, 4-4-2, of een 7v7 variant — jij bepaalt.",
  },
  {
    step: "2",
    title: "Sleep spelers op het veld",
    description: "Drag & drop naar de juiste positie. Makkelijker dan een bierviltje.",
  },
  {
    step: "3",
    title: "Plan je wissels",
    description: "Stel wisselmomenten in en iedereen speelt eerlijk.",
  },
];

export default function OpstellingenPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 px-4 pb-16 pt-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-white/10">
            <ClipboardList className="size-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Opstelling maken met drag &amp; drop
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Geen bierviltjes meer. Maak visuele opstellingen en plan wissels met automatische speeltijdverdeling.
          </p>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-neutral-900">Herkenbaar?</h2>
          <p className="mt-3 text-muted-foreground">
            De opstelling in je hoofd, op een bierviltje, of in de notities van je telefoon.
            Wissels bijhouden op gevoel. En na het seizoen geen idee wie hoeveel heeft gespeeld.
          </p>

          <h2 className="mt-12 text-2xl font-bold text-neutral-900">
            Zo lost MyTeamPlanner dit op
          </h2>
          <ul className="mt-6 space-y-4">
            {solutions.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 size-5 shrink-0 text-success-600" />
                <span className="text-neutral-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-neutral-50 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-neutral-900">Hoe het werkt</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-3 font-semibold text-neutral-900">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary-800 to-primary-600 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white">Probeer het gratis</h2>
          <p className="mt-3 text-white/80">In 2 minuten je team aangemaakt. Geen creditcard nodig.</p>
          <Link
            href="/register"
            className="mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-white px-8 text-base font-semibold text-primary-800 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
          >
            Gratis starten
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
