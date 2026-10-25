import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

const GROUP_URL = "https://groups.google.com/g/myteamplanner-android-testers";
const TESTING_URL = "https://play.google.com/apps/testing/nl.myteamplanner.app";

export const metadata: Metadata = {
  title: "Android-app installeren",
  description:
    "Installeer de MyTeamPlanner Android-app via Google Play in twee stappen. Gratis, zelfde account als de webversie.",
  alternates: {
    canonical: "https://www.myteamplanner.nl/android",
  },
};

const steps = [
  {
    title: "Word lid van de testgroep",
    body: "Open de Google-groep en klik op “Lid worden”. Je hebt alleen een Google-account nodig; de groep stuurt geen e-mails.",
    href: GROUP_URL,
    label: "Naar de Google-groep",
  },
  {
    title: "Meld je aan als tester",
    body: "Open de testpagina en klik op “Tester worden”. Daarna vind je MyTeamPlanner in de Play Store op je telefoon.",
    href: TESTING_URL,
    label: "Naar de testpagina",
  },
];

export default function AndroidPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Terug
      </Link>

      <h1 className="mb-3 text-2xl font-bold">MyTeamPlanner als Android-app</h1>
      <p className="mb-8 text-muted-foreground">
        De app staat in Google Play als testversie. Installeren is gratis en je logt in met
        hetzelfde account als op myteamplanner.nl. Het kost twee klikken, daarna werkt alles
        zoals je gewend bent, inclusief meldingen.
      </p>

      <ol className="space-y-6">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-700 text-sm font-semibold text-white">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-neutral-900">{step.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
                <a
                  href={step.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-primary-700 px-4 text-sm font-semibold text-white hover:bg-primary-800"
                >
                  {step.label}
                  <ExternalLink className="size-4" />
                </a>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-10 space-y-3 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-neutral-900">Goed om te weten</h2>
        <p>
          Gebruik voor beide stappen het Google-account dat ook op je Android-telefoon staat.
          Anders zie je de app niet in de Play Store.
        </p>
        <p>
          Waarom een testversie? Google laat nieuwe apps pas vrij in de Store nadat genoeg
          mensen ze een paar weken hebben gebruikt. Door mee te doen help je de app sneller
          voor iedereen beschikbaar te maken.
        </p>
        <p>
          Liever geen app? De webversie werkt op elke telefoon; voeg myteamplanner.nl toe aan
          je startscherm.
        </p>
      </section>
    </main>
  );
}
