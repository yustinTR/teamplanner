import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LineupMakerTool } from "@/components/organisms/LineupMakerTool";
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
  const url = `https://www.myteamplanner.nl/tools/opstelling/${page.slug}`;
  const formations = page.formations.map((f) => f.formation).join(", ");
  const title = `Opstelling ${page.name}: formaties en gratis tool`;
  const description = `De beste opstellingen voor ${page.name} (${page.audience}): ${formations}. Maak je opstelling gratis online en deel hem als afbeelding in de groepsapp.`;
  return {
    title,
    description,
    keywords: page.lineupKeywords,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", siteName: "MyTeamPlanner", images: [{ url: "/api/og", width: 1200, height: 630 }] },
  };
}

export default async function FormatLineupPage({ params }: PageProps) {
  const page = getFormatPage((await params).vorm);
  if (!page) notFound();
  const others = FORMAT_PAGES.filter((p) => p.slug !== page.slug);

  return (
    <ToolLandingTemplate
      breadcrumb={`Opstelling ${page.name}`}
      title={`Opstelling ${page.name} maken`}
      intro={`Kies een formatie voor ${page.name} (${page.audience}), vul je spelers in en deel de opstelling als afbeelding in de groepsapp. Gratis en zonder account.`}
      facts={page.facts}
      sections={[
        {
          heading: `Formaties voor ${page.name}`,
          paragraphs: page.formations.map((f) => `${f.formation}: ${f.tip}`),
        },
      ]}
      faq={page.faq}
      related={[
        { href: `/tools/wisselschema/${page.slug}`, label: `Wisselschema ${page.name}` },
        ...others.map((p) => ({ href: `/tools/opstelling/${p.slug}`, label: `Opstelling ${p.name}` })),
        { href: "/blog/speelvormen-jeugdvoetbal-knvb", label: "Speelvormen jeugdvoetbal" },
      ]}
    >
      <LineupMakerTool initialFormat={page.toolFormat} />
    </ToolLandingTemplate>
  );
}
