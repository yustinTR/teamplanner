import type { Metadata } from "next";
import Link from "next/link";
import { Users, ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Beschikbaarheid bijhouden voor je voetbalteam",
  description:
    "Nooit meer vragen wie er kan spelen. Spelers geven met één tik hun beschikbaarheid door. De coach ziet realtime wie er beschikbaar is.",
  alternates: {
    canonical: "https://myteamplanner.nl/features/beschikbaarheid",
  },
};

const solutions = [
  "Spelers geven met één tik aan: beschikbaar, afwezig of misschien",
  "Realtime overzicht voor de coach — geen WhatsApp-berichten meer tellen",
  "Automatische herinneringen zodat iedereen op tijd reageert",
  "Werkt op elke telefoon, geen app store nodig",
];

const steps = [
  {
    step: "1",
    title: "Coach maakt wedstrijd aan",
    description: "Voeg de tegenstander, datum en locatie toe.",
  },
  {
    step: "2",
    title: "Spelers reageren",
    description: "Met één tik geven spelers aan of ze er bij zijn.",
  },
  {
    step: "3",
    title: "Coach ziet het overzicht",
    description: "Realtime grid toont wie er kan spelen.",
  },
];

export default function BeschikbaarheidPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 px-4 pb-16 pt-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-white/10">
            <Users className="size-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Beschikbaarheid bijhouden voor je voetbalteam
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Nooit meer &quot;wie kan er zaterdag?&quot; in de WhatsApp-groep. Spelers reageren zelf, de coach houdt overzicht.
          </p>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-neutral-900">
            Herkenbaar?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Het is donderdagavond en je weet nog steeds niet wie er zaterdag kan spelen.
            Je stuurt een bericht in de groep, 3 van de 18 reageren. Vrijdagavond nog
            steeds geen compleet beeld. Klinkt dat bekend?
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
          <h2 className="text-center text-2xl font-bold text-neutral-900">
            Hoe het werkt
          </h2>
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
          <h2 className="text-2xl font-bold text-white">
            Probeer het gratis
          </h2>
          <p className="mt-3 text-white/80">
            In 2 minuten je team aangemaakt. Geen creditcard nodig.
          </p>
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
