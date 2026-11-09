import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { FaqSection } from "@/components/molecules/FaqSection";
import { FORMAT_PAGES } from "@/lib/format-pages";
import { LineupMakerTool } from "@/components/organisms/LineupMakerTool";

const url = "https://www.myteamplanner.nl/tools/opstelling";

export const metadata: Metadata = {
  title: "Voetbal opstelling maken (gratis, zonder account)",
  description:
    "Maak je voetbalopstelling online: kies 11, 8, 7 of 6 tegen 6 en een formatie, vul je spelers in en deel de opstelling als afbeelding of tekst in de groepsapp. Gratis.",
  keywords: [
    "voetbal opstelling maken",
    "opstelling maken online",
    "opstelling maker voetbal",
    "voetbal opstelling 8 tegen 8",
    "voetbal opstelling 6 tegen 6",
    "formatie maker",
  ],
  alternates: { canonical: url },
  openGraph: {
    title: "Voetbal opstelling maken — gratis tool",
    description: "Formatie kiezen, spelers invullen, delen in de groepsapp.",
    url,
    type: "website",
    siteName: "MyTeamPlanner",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    question: "Welke formaties kan ik kiezen?",
    answer:
      "Voor 11 tegen 11 onder meer 4-3-3, 4-4-2 en 3-5-2. Voor 8 tegen 8 (JO11 en JO12) 3-3-1, 2-4-1, 2-3-2 en 3-2-2. Voor 6 tegen 6 (JO8 tot en met JO10) 2-2-1, 1-3-1 en 2-1-2, en voor 7 tegen 7 onder meer 2-3-1 en 3-2-1.",
  },
  {
    question: "Hoe zet ik een speler op een andere plek?",
    answer:
      "De namen vullen de posities in de volgorde waarin je ze typt. Onder ‘Wie staat waar?’ kies je per positie een andere speler; de rest schuift vanzelf door en wie overblijft staat op de bank.",
  },
  {
    question: "Moet ik een account maken?",
    answer:
      "Nee, de tool werkt zonder account en slaat niets op. Met een gratis account zie je wie er beschikbaar is, plan je wissels en bewaar je je opstellingen.",
  },
];

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Voetbal opstelling maken — MyTeamPlanner",
  url,
  applicationCategory: "SportsApplication",
  operatingSystem: "Web",
  inLanguage: "nl",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
};

export default function LineupMakerToolPage() {
  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <main className="px-4 pb-16 pt-10">
        <div className="mx-auto max-w-2xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }, { label: "Opstelling maken" }]} />
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
            Voetbal opstelling maken
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Kies je speelvorm en formatie, vul je spelers in en deel de opstelling als afbeelding in de
            groepsapp. Gratis, zonder account.
          </p>

          <div className="mt-8">
            <LineupMakerTool />
          </div>

          <section className="mt-12 space-y-3 text-neutral-700">
            <h2 className="text-xl font-bold text-neutral-900">Welke speelvorm hoort bij je team?</h2>
            <p className="leading-relaxed">
              Volgens de KNVB spelen JO8 tot en met JO10 6 tegen 6, JO11 en JO12 8 tegen 8 en vanaf
              JO13 11 tegen 11. Tips per formatie lees je in{" "}
              <Link href="/blog/opstelling-maken-voetbal" className="font-semibold text-primary-700 underline-offset-4 hover:underline">
                Voetbal opstelling maken en delen
              </Link>
              . Wil je ook de wissels eerlijk verdelen? Gebruik dan de{" "}
              <Link href="/tools/wisselschema" className="font-semibold text-primary-700 underline-offset-4 hover:underline">
                wisselschema-tool
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <nav aria-label="Per speelvorm" className="mx-auto max-w-2xl px-4 pb-12">
        <h2 className="text-base font-semibold text-neutral-900">Opstelling per speelvorm</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {FORMAT_PAGES.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/tools/opstelling/${p.slug}`}
                className="inline-flex min-h-[44px] items-center rounded-full border border-neutral-200 px-4 text-sm font-medium text-neutral-700 hover:border-primary-600 hover:text-primary-700"
              >
                Opstelling {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <FaqSection items={faqItems} />
    </div>
  );
}
