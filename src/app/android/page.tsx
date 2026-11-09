import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AndroidTesterSteps } from "@/components/molecules/AndroidTesterSteps";
import { TesterShareButton } from "@/components/molecules/TesterShareButton";
import { TEST_DAYS, TESTERS_NEEDED } from "@/lib/android-testing";

export const metadata: Metadata = {
  title: "Android-app installeren",
  description:
    "Installeer de MyTeamPlanner Android-app via Google Play in twee stappen en help de app de Play Store in. Gratis, zelfde account als de webversie.",
  alternates: {
    canonical: "https://www.myteamplanner.nl/android",
  },
};

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
      <p className="mb-4 text-muted-foreground">
        De app staat in Google Play als testversie. Installeren is gratis en je logt in met
        hetzelfde account als op myteamplanner.nl. Daarna werkt alles zoals je gewend bent,
        inclusief meldingen.
      </p>

      <div className="mb-8 rounded-xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-900">
        <p className="font-semibold">We zoeken {TESTERS_NEEDED} testers</p>
        <p className="mt-1 text-primary-800">
          Google zet een nieuwe app pas in de Play Store als {TESTERS_NEEDED} mensen hem{" "}
          {TEST_DAYS} dagen op hun telefoon hebben. Je hoeft niets bijzonders te doen: installeer
          de app en laat hem staan. Ken je andere trainers, spelers of ouders met Android? Stuur
          deze pagina door.
        </p>
        <TesterShareButton placement="android_page" className="mt-3" label="Stuur deze pagina door" />
      </div>

      <AndroidTesterSteps />

      <section className="mt-10 space-y-3 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-neutral-900">Goed om te weten</h2>
        <p>
          Gebruik voor beide stappen het Google-account dat ook op je Android-telefoon staat.
          Anders zie je de app niet in de Play Store.
        </p>
        <p>
          Google telt testers die {TEST_DAYS} dagen achter elkaar aangemeld blijven. Meld je dus
          niet tussendoor af. Gebruik de app gewoon voor je team; Google vraagt ons ook hoe
          testers de app gebruikt hebben.
        </p>
        <p>
          Liever geen app? De webversie werkt op elke telefoon; voeg myteamplanner.nl toe aan
          je startscherm.
        </p>
      </section>
    </main>
  );
}
