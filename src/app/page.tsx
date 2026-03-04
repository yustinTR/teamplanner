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
import { FaqSection } from "@/components/molecules/FaqSection";
import { MarketingFooter } from "@/components/organisms/MarketingFooter";
import { HeroDemo } from "@/components/molecules/HeroDemo";
import { SocialProof } from "@/components/molecules/SocialProof";
import { StickyCta } from "@/components/molecules/StickyCta";
import { createClient } from "@/lib/supabase/server";

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
    href: "/features/wedstrijden",
    illustration: (
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/80 p-2 text-[10px]">
        <div className="rounded bg-primary-100 px-1.5 py-0.5 font-medium text-primary-700">
          Za 14:30
        </div>
        <span className="font-medium text-neutral-700">vs FC Hoorn</span>
        <span className="ml-auto font-bold text-neutral-900">3 - 1</span>
      </div>
    ),
  },
  {
    icon: Users,
    title: "Beschikbaarheid",
    description:
      "Spelers geven met een tik aan of ze er zijn. Geen eindeloze WhatsApp-berichten meer.",
    color: "bg-success-100 text-success-700",
    href: "/features/beschikbaarheid",
    illustration: (
      <div className="mt-3 flex gap-1.5">
        {["bg-success", "bg-success", "bg-danger", "bg-success", "bg-warning", "bg-success"].map(
          (c, i) => (
            <div key={i} className={`size-4 rounded-full ${c}`} />
          )
        )}
        <span className="ml-1 text-[10px] font-medium text-neutral-500">
          4/6
        </span>
      </div>
    ),
  },
  {
    icon: ClipboardList,
    title: "Opstellingen & Wissels",
    description:
      "Sleep spelers naar het veld. Automatisch wisselschema met eerlijke speeltijd.",
    color: "bg-warning-100 text-warning-700",
    href: "/features/opstellingen",
    illustration: (
      <div className="mt-3 flex items-center gap-2">
        <div className="relative size-10 rounded bg-emerald-600">
          {[
            { x: 50, y: 20 },
            { x: 25, y: 50 },
            { x: 75, y: 50 },
            { x: 50, y: 80 },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute size-1.5 rounded-full bg-white"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: "translate(-50%,-50%)",
              }}
            />
          ))}
        </div>
        <span className="text-[10px] text-neutral-500">4-3-3</span>
      </div>
    ),
  },
  {
    icon: PartyPopper,
    title: "Trainingen & Evenementen",
    description:
      "Kant-en-klare trainingsoefeningen en teamactiviteiten organiseren.",
    color: "bg-danger-100 text-danger-700",
    href: "/features/trainingen",
    illustration: (
      <div className="mt-3 flex flex-wrap gap-1">
        {["Positiespel", "Afwerken", "Warming-up"].map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-white/80 px-2 py-0.5 text-[9px] font-medium text-neutral-600"
          >
            {tag}
          </span>
        ))}
      </div>
    ),
  },
];

const coachQuotes = [
  {
    quote: "Eindelijk weet ik op donderdag al wie er zaterdag kan spelen.",
    name: "Coach Willem",
    team: "Be Fair 5",
  },
  {
    quote:
      "Mijn spelers vinden het geweldig dat ze de opstelling in de app kunnen zien.",
    name: "Trainer Karin",
    team: "VV Drieberg JO13",
  },
  {
    quote: "Het wisselschema bespaart me elke week minstens een kwartier.",
    name: "Coach Martijn",
    team: "DSVP G1",
  },
];

const faqItems = [
  {
    question: "Is MyTeamPlanner echt gratis?",
    answer:
      "Ja, MyTeamPlanner is volledig gratis. Geen creditcard nodig, geen verborgen kosten. Alle functies zijn beschikbaar voor iedereen.",
  },
  {
    question: "Hoe werkt de beschikbaarheid?",
    answer:
      "Spelers geven met één tik aan of ze beschikbaar, afwezig of misschien kunnen. De coach ziet een realtime overzicht van het hele team.",
  },
  {
    question: "Kan ik opstellingen maken met drag & drop?",
    answer:
      "Ja, kies een formatie en sleep spelers naar hun positie op het veld. Je kunt ook een wisselschema maken met automatische speeltijdverdeling.",
  },
  {
    question: "Werkt het ook voor jeugdteams en G-teams?",
    answer:
      "Ja, met aangepaste formaties voor 7v7 en 8v8, grote touch targets en oefeningen per niveau. Speciaal geschikt voor jeugd- en G-voetbal.",
  },
  {
    question: "Moet ik iets installeren?",
    answer:
      "Nee, MyTeamPlanner is een web-app die je kunt toevoegen aan je homescreen. Werkt op elke telefoon, geen app store nodig.",
  },
  {
    question: "Hoe nodig ik mijn team uit?",
    answer:
      "Deel de uitnodigingslink via WhatsApp. Spelers klikken op de link, maken een account aan en zijn direct gekoppeld aan je team.",
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

export default async function LandingPage() {
  // Fetch team count for social proof
  const supabase = await createClient();
  const { count: teamCount } = await supabase
    .from("teams")
    .select("*", { count: "exact", head: true });

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

        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-12 sm:pb-20 sm:pt-16">
          <div className="flex flex-col items-center gap-10 md:flex-row md:gap-12">
            {/* Left — Text */}
            <div className="flex-1 text-center md:text-left">
              <span className="inline-flex items-center rounded-full bg-primary-500/20 px-3 py-1 text-xs font-medium text-primary-200">
                Gratis voor amateurvoetbal
              </span>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                Nooit meer &lsquo;wie kan er zaterdag?&rsquo; in de groepsapp
              </h1>
              <p className="mt-4 max-w-lg text-base text-white/80 sm:text-lg md:mx-0">
                De gratis teamplanner voor amateurvoetbal. Beschikbaarheid,
                opstellingen en wedstrijden — alles in een app.
              </p>

              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
                <Link
                  id="hero-cta"
                  href="/register"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-white px-8 text-base font-semibold text-primary-800 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
                >
                  Maak je team aan
                  <ArrowRight className="size-5" />
                </Link>
                <a
                  href="#functies"
                  className="inline-flex items-center gap-1 text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  Bekijk hoe het werkt ↓
                </a>
              </div>

              <p className="mt-3 text-xs text-white/40">
                Gratis · Geen creditcard · Klaar in 30 seconden
              </p>
            </div>

            {/* Right — Animated Demo */}
            <div className="flex-shrink-0">
              <HeroDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <SocialProof teamCount={teamCount ?? 0} quotes={coachQuotes} />

      {/* Features section */}
      <section className="bg-white py-16" id="functies">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
              De complete teamplanner voor amateurvoetbal
            </h2>
            <p className="mt-2 text-muted-foreground">
              Geen WhatsApp-chaos meer. Alles geregeld in een app.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="rounded-2xl border border-neutral-100 bg-neutral-50 p-6 transition-shadow hover:shadow-md"
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
                {feature.illustration}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
              In 3 stappen je team organiseren
            </h2>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Maak je team aan",
                description:
                  "Registreer je en maak je team aan in een paar klikken.",
                illustration: (
                  <div className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-lg bg-white px-3 py-1.5 shadow-sm">
                    <Users className="size-4 text-primary-600" />
                    <span className="text-xs font-medium text-neutral-700">
                      VV Drieberg JO13
                    </span>
                  </div>
                ),
              },
              {
                step: "2",
                title: "Deel de link in WhatsApp",
                description:
                  "Spelers joinen met een tik via de uitnodigingslink.",
                illustration: (
                  <div className="mx-auto mb-3 w-fit rounded-lg bg-[#dcf8c6] px-3 py-2 text-left shadow-sm">
                    <p className="text-[10px] font-medium text-neutral-800">
                      Doe mee met VV Drieberg JO13!
                    </p>
                    <p className="text-[9px] text-blue-600 underline">
                      myteamplanner.nl/join/abc123
                    </p>
                  </div>
                ),
              },
              {
                step: "3",
                title: "Klaar! Spelers reageren direct",
                description:
                  "Spelers geven beschikbaarheid door en jij maakt de opstelling.",
                illustration: (
                  <div className="mx-auto mb-3 flex w-fit gap-1">
                    {[
                      "bg-success",
                      "bg-success",
                      "bg-danger",
                      "bg-success",
                      "bg-warning",
                    ].map((c, i) => (
                      <div
                        key={i}
                        className={`size-3.5 rounded-full ${c}`}
                      />
                    ))}
                  </div>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white">
                  {item.step}
                </div>
                {item.illustration}
                <h3 className="mt-2 font-semibold text-neutral-900">
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

      {/* FAQ section */}
      <FaqSection items={faqItems} />

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

      <MarketingFooter />

      {/* Sticky mobile CTA */}
      <StickyCta targetId="hero-cta" />
    </div>
  );
}
