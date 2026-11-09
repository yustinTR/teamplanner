import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SubstitutionScheduleTool } from "@/components/organisms/SubstitutionScheduleTool";
import { ToolLandingTemplate } from "@/components/templates/ToolLandingTemplate";
import { FORMAT_PAGES, getFormatPage } from "@/lib/format-pages";

interface PageProps {
  params: Promise<{ vorm: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return FORMAT_PAGES.map((p) => ({ vorm: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = getFormatPage((await params).vorm);
  if (!page) return {};
  const url = `https://www.myteamplanner.nl/tools/wisselschema/${page.slug}`;
  const title = `Wisselschema ${page.name} maken (${page.audience})`;
  const description = `Maak gratis een eerlijk wisselschema voor ${page.name}: vul je spelers in en zie direct de speelminuten. Voor ${page.audience}. Delen als afbeelding of tekst.`;
  return {
    title,
    description,
    keywords: page.scheduleKeywords,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", siteName: "MyTeamPlanner", images: [{ url: "/api/og", width: 1200, height: 630 }] },
  };
}

export default async function FormatSchedulePage({ params }: PageProps) {
  const page = getFormatPage((await params).vorm);
  if (!page) notFound();
  const others = FORMAT_PAGES.filter((p) => p.slug !== page.slug);

  return (
    <ToolLandingTemplate
      breadcrumb={`Wisselschema ${page.name}`}
      title={`Wisselschema ${page.name} maken`}
      intro={`Eerlijke speeltijd voor je team in ${page.name} (${page.audience}). Vul je spelers in, de eerste is de keeper, en deel het schema direct in de groepsapp. Gratis en zonder account.`}
      facts={page.facts}
      sections={[
        { heading: `Voorbeeld: wisselschema ${page.name}`, paragraphs: [page.scheduleExample] },
        {
          heading: "Hoe de tool het eerlijk verdeelt",
          paragraphs: [
            "De keeper speelt de hele wedstrijd. De veldspelers gaan om de beurt naar de bank, zodat het aantal bankbeurten per speler hooguit één verschilt. De tool kiest het aantal wisselmomenten waarbij het verschil in speeltijd klein blijft zonder dat je elke paar minuten hoeft te wisselen.",
          ],
        },
      ]}
      faq={page.faq}
      related={[
        { href: `/tools/opstelling/${page.slug}`, label: `Opstelling ${page.name}` },
        ...others.map((p) => ({ href: `/tools/wisselschema/${p.slug}`, label: `Wisselschema ${p.name}` })),
        { href: "/blog/speelvormen-jeugdvoetbal-knvb", label: "Speelvormen jeugdvoetbal" },
      ]}
    >
      <SubstitutionScheduleTool initialFormat={page.toolFormat} />
    </ToolLandingTemplate>
  );
}
