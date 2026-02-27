import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Wedstrijdbeheer voor amateurvoetbal",
  description:
    "Plan wedstrijden, importeer programma's van voetbal.nl, houd scores bij en bekijk spelerstatistieken. Alles wat een amateurvoetbalcoach nodig heeft.",
  alternates: {
    canonical: "https://myteamplanner.nl/features/wedstrijden",
  },
};

const solutions = [
  "Wedstrijden aanmaken met tegenstander, datum, locatie en thuis/uit",
  "Automatisch importeren van je wedstrijdprogramma via voetbal.nl",
  "Scores bijhouden en wedstrijdstatistieken per speler invullen",
  "Seizoensoverzicht met topscorer, meeste minuten en meeste wedstrijden",
  "Verzameltijd automatisch berekend inclusief reistijd voor uitwedstrijden",
];

const steps = [
  {
    step: "1",
    title: "Voeg wedstrijden toe",
    description: "Handmatig of importeer direct van je clubwebsite.",
  },
  {
    step: "2",
    title: "Spelers geven beschikbaarheid door",
    description: "Iedereen ziet de wedstrijd en reageert zelf.",
  },
  {
    step: "3",
    title: "Rond de wedstrijd af",
    description: "Vul de score in en bouw je seizoensstatistieken op.",
  },
];

export default function WedstrijdenPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 px-4 pb-16 pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-white/10">
            <Calendar className="size-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Wedstrijdbeheer voor amateurvoetbal
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Van wedstrijdplanning tot seizoensstatistieken. Alles wat je als coach nodig hebt op een plek.
          </p>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-neutral-900">Herkenbaar?</h2>
          <p className="mt-3 text-muted-foreground">
            Wedstrijden bijhouden in je agenda, scores onthouden, en aan het eind van het seizoen
            geen idee wie de topscorer was. Laat staan hoeveel iedereen heeft gespeeld.
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
