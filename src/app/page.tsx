import Link from "next/link";
import type { Metadata } from "next";
import {
  Calendar,
  Users,
  ClipboardList,
  ArrowRight,
  PartyPopper,
  Smartphone,
  Shield,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "MyTeamPlanner — Gratis teamplanner voor amateurvoetbal",
  description:
    "De gratis app voor amateurvoetbalteams. Beheer wedstrijden, opstellingen, beschikbaarheid en evenementen. Makkelijker dan WhatsApp, speciaal voor coaches en spelers.",
  alternates: {
    canonical: "https://myteamplanner.nl",
  },
};

const features = [
  {
    icon: Calendar,
    title: "Wedstrijden",
    description:
      "Plan wedstrijden, importeer programma's van je club en houd de stand bij.",
    color: "bg-primary-100 text-primary-700",
  },
  {
    icon: Users,
    title: "Beschikbaarheid",
    description:
      "Spelers geven met een tik aan of ze er zijn. Geen eindeloze WhatsApp-berichten meer.",
    color: "bg-success-100 text-success-700",
  },
  {
    icon: ClipboardList,
    title: "Opstellingen & Wissels",
    description:
      "Sleep spelers naar het veld. Automatisch wisselschema met eerlijke speeltijd.",
    color: "bg-warning-100 text-warning-700",
  },
  {
    icon: PartyPopper,
    title: "Evenementen",
    description:
      "Organiseer toernooien, feestjes en teamuitjes. Met takenlijst en aanwezigheid.",
    color: "bg-danger-100 text-danger-700",
  },
];

const benefits = [
  {
    icon: Smartphone,
    title: "Altijd bij de hand",
    description: "Installeerbaar als app op je telefoon. Werkt ook offline.",
  },
  {
    icon: Shield,
    title: "Gratis & veilig",
    description: "Helemaal gratis voor je team. Je data is van jou.",
  },
  {
    icon: Zap,
    title: "Simpel & snel",
    description: "In 2 minuten aan de slag. Geen ingewikkelde instellingen.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        {/* Football pitch pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-white" />
          <div className="absolute inset-y-[10%] left-0 w-[20%] border-[3px] border-l-0 border-white" />
          <div className="absolute inset-y-[10%] right-0 w-[20%] border-[3px] border-r-0 border-white" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-16 text-center">
          {/* Logo */}
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <svg
              viewBox="0 0 24 24"
              className="size-11 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
              <path d="M12 2c2.5 4 4 8 4 10s-1.5 6-4 10" />
              <path d="M12 2c-2.5 4-4 8-4 10s1.5 6 4 10" />
            </svg>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            MyTeamPlanner
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            De gratis teamplanner voor amateurvoetbal. Wedstrijden plannen,
            beschikbaarheid bijhouden en opstellingen maken — allemaal op
            een plek.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-white px-8 text-base font-semibold text-primary-800 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
            >
              Gratis starten
              <ArrowRight className="size-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-[48px] items-center rounded-xl border border-white/30 px-8 text-base font-medium text-white transition-colors hover:bg-white/10"
            >
              Inloggen
            </Link>
          </div>

          <p className="mt-4 text-sm text-white/50">
            Geen creditcard nodig. Direct aan de slag.
          </p>
        </div>
      </section>

      {/* Features section */}
      <section className="bg-white py-16" id="functies">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
              Alles wat je team nodig heeft
            </h2>
            <p className="mt-2 text-muted-foreground">
              Geen WhatsApp-chaos meer. Alles geregeld in een app.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-neutral-100 bg-neutral-50 p-6"
              >
                <div
                  className={`inline-flex size-12 items-center justify-center rounded-xl ${feature.color}`}
                >
                  <feature.icon className="size-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
              In 3 stappen klaar
            </h2>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Maak een team aan",
                description: "Registreer je en maak je team aan in een paar klikken.",
              },
              {
                step: "2",
                title: "Nodig spelers uit",
                description: "Deel de uitnodigingslink. Spelers joinen zelf het team.",
              },
              {
                step: "3",
                title: "Plan je wedstrijd",
                description: "Maak wedstrijden aan en laat spelers hun beschikbaarheid doorgeven.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-4 font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid gap-8 sm:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                  <benefit.icon className="size-6" />
                </div>
                <h3 className="mt-3 font-semibold text-neutral-900">
                  {benefit.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Klaar om je team te organiseren?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/80">
            Begin vandaag nog met MyTeamPlanner. Gratis, voor altijd.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-white px-8 text-base font-semibold text-primary-800 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
          >
            Gratis account aanmaken
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-neutral-900 py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2 text-white">
              <svg
                viewBox="0 0 24 24"
                className="size-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
              <span className="font-semibold">MyTeamPlanner</span>
            </div>
            <p className="text-sm text-neutral-400">
              De gratis teamplanner voor amateurvoetbal in Nederland.
            </p>
            <nav className="flex gap-6 text-sm text-neutral-400">
              <Link href="/login" className="hover:text-white">
                Inloggen
              </Link>
              <Link href="/register" className="hover:text-white">
                Registreren
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
