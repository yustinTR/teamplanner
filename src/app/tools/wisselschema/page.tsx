import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { FaqSection } from "@/components/molecules/FaqSection";
import { SubstitutionScheduleTool } from "@/components/organisms/SubstitutionScheduleTool";

const url = "https://www.myteamplanner.nl/tools/wisselschema";

export const metadata: Metadata = {
  title: "Wisselschema maken (gratis, zonder account)",
  description:
    "Maak in één minuut een eerlijk wisselschema voor je voetbalteam. Vul je spelers in, kies 11, 8 of 6 tegen 6 en deel het schema als afbeelding of tekst in de groepsapp.",
  keywords: [
    "wisselschema maken",
    "wisselschema generator",
    "wisselschema voetbal",
    "wisselschema jeugdvoetbal",
    "wisselschema 8 tegen 8",
    "wisselschema 6 tegen 6",
    "speeltijd verdelen voetbal",
  ],
  alternates: { canonical: url },
  openGraph: {
    title: "Wisselschema maken — gratis voetbaltool",
    description: "Eerlijke speeltijd voor iedereen, in één minuut. Delen als afbeelding in de groepsapp.",
    url,
    type: "website",
    siteName: "MyTeamPlanner",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    question: "Hoe maakt de tool het schema eerlijk?",
    answer:
      "De keeper speelt de hele wedstrijd. De veldspelers gaan om de beurt naar de bank: elke wisselbeurt zijn de volgende spelers in de rij aan de beurt. Zo verschilt het aantal bankbeurten per speler hooguit één, en de tool kiest het aantal wisselmomenten waarbij het verschil in speeltijd het kleinst is.",
  },
  {
    question: "Welke speelvormen kan ik kiezen?",
    answer:
      "Alle KNVB-vormen: 11 tegen 11 voor senioren en JO13 tot en met JO19, 8 tegen 8 voor JO11 en JO12 (2x30 minuten) en 6 tegen 6 voor JO8 tot en met JO10. Daarnaast 7 tegen 7 voor 7x7-competities en toernooien.",
  },
  {
    question: "Moet ik een account maken?",
    answer:
      "Nee. De tool werkt zonder account en slaat niets op. Wil je je spelers bewaren en de speelminuten over het hele seizoen bijhouden, dan kun je gratis een account maken.",
  },
  {
    question: "Kan ik het schema delen in WhatsApp?",
    answer:
      "Ja. Deel het als afbeelding via het deelmenu van je telefoon, of kopieer het als tekst en plak het in de groepsapp.",
  },
];

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Wisselschema maken — MyTeamPlanner",
  url,
  applicationCategory: "SportsApplication",
  operatingSystem: "Web",
  inLanguage: "nl",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
};

export default function SubstitutionScheduleToolPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <main className="px-4 pb-16 pt-10">
        <div className="mx-auto max-w-2xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools" },
              { label: "Wisselschema maken" },
            ]}
          />
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
            Wisselschema maken
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Vul je spelers in en krijg direct een eerlijk wisselschema met speelminuten. Gratis,
            zonder account, en te delen als afbeelding in de groepsapp.
          </p>

          <div className="mt-8">
            <SubstitutionScheduleTool />
          </div>

          <section className="mt-12 space-y-3 text-neutral-700">
            <h2 className="text-xl font-bold text-neutral-900">Zo werkt een eerlijk wisselschema</h2>
            <p className="leading-relaxed">
              Tel eerst de veldminuten: bij 8 tegen 8 en 2x 30 minuten zijn dat 7 veldposities x 60
              minuten = 420 minuten. Met negen veldspelers is dat ruim 46 minuten per speler. De tool
              verdeelt de wedstrijd in gelijke periodes en laat de spelers om de beurt op de bank
              zitten, zodat niemand twee keer achter elkaar wisselt terwijl een ander de hele
              wedstrijd speelt.
            </p>
            <p className="leading-relaxed">
              Gaat het niet precies gelijk op, dan is het verschil hooguit één periode. Laat de week
              erna een andere speler die extra beurt nemen. Meer uitleg en een uitgewerkt voorbeeld
              lees je in{" "}
              <Link href="/blog/wisselschema-jeugdvoetbal" className="font-semibold text-primary-700 underline-offset-4 hover:underline">
                Wisselschema jeugdvoetbal: voorbeeld 8 tegen 8
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <FaqSection items={faqItems} />
    </div>
  );
}
