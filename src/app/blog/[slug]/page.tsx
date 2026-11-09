import { Fragment } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock } from "lucide-react";
import {
  blogPosts,
  getBlogPost,
  getAllSlugs,
  type BlogPost,
  type BlogPostCta,
} from "@/lib/blog";
import {
  DEMO_FORMATION,
  DEMO_MATCH_DATE,
  DEMO_OPPONENT,
  DEMO_TEAM,
  DEMO_FORMATION_7,
  DEMO_OPPONENT_7,
  DEMO_TEAM_7,
  demoBench,
  demoBench7,
  demoLineupPlayers,
  demoLineupPlayers7,
  demoLineupSubstitutions,
  demoSubstitutionPlan,
} from "@/lib/blog-cta-demo";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { BlogCta } from "@/components/molecules/BlogCta";
import { ShareLineupCard } from "@/components/molecules/ShareLineupCard";
import { ShareSubstitutionPlan } from "@/components/molecules/ShareSubstitutionPlan";

function renderCtaPreview(preview: BlogPostCta["preview"]) {
  if (preview === "substitution-plan") {
    return (
      <ShareSubstitutionPlan
        teamName={DEMO_TEAM}
        opponent={DEMO_OPPONENT}
        matchDate={DEMO_MATCH_DATE}
        plan={demoSubstitutionPlan}
      />
    );
  }
  if (preview === "lineup") {
    return (
      <ShareLineupCard
        teamName={DEMO_TEAM}
        opponent={DEMO_OPPONENT}
        matchDate={DEMO_MATCH_DATE}
        formation={DEMO_FORMATION}
        players={demoLineupPlayers}
        benchNames={demoBench}
        substitutions={demoLineupSubstitutions}
      />
    );
  }
  if (preview === "lineup-7") {
    return (
      <ShareLineupCard
        teamName={DEMO_TEAM_7}
        opponent={DEMO_OPPONENT_7}
        matchDate={DEMO_MATCH_DATE}
        formation={DEMO_FORMATION_7}
        players={demoLineupPlayers7}
        benchNames={demoBench7}
      />
    );
  }
  return undefined;
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: "Artikel niet gevonden" };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `https://www.myteamplanner.nl/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://www.myteamplanner.nl/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      siteName: "MyTeamPlanner",
      images: [{ url: "/api/og", width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Find related posts (curated via relatedSlugs, fallback to first 3 others)
  const relatedPosts = post.relatedSlugs?.length
    ? post.relatedSlugs
        .map((s) => blogPosts.find((p) => p.slug === s))
        .filter((p): p is BlogPost => p !== undefined)
    : blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `https://www.myteamplanner.nl/blog/${post.slug}`,
    inLanguage: "nl",
    author: {
      "@type": "Organization",
      name: "MyTeamPlanner",
      url: "https://www.myteamplanner.nl",
    },
    publisher: {
      "@type": "Organization",
      name: "MyTeamPlanner",
      url: "https://www.myteamplanner.nl",
      logo: {
        "@type": "ImageObject",
        url: "https://www.myteamplanner.nl/icons/icon-192x192.svg",
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="px-4 pb-16 pt-12">
        <div className="mx-auto max-w-2xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />

          {/* Header */}
          <header className="mt-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("nl-NL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              <span className="text-neutral-300">·</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {post.readingTime}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {post.description}
            </p>
          </header>

          {/* Content */}
          <div className="mt-10 space-y-8">
            {post.sections.map((section, index) => (
              <Fragment key={section.heading}>
                <section>
                  <h2 className="text-xl font-bold text-neutral-900">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((paragraph, i) => (
                    <p
                      key={i}
                      className="mt-3 leading-relaxed text-neutral-700"
                    >
                      {paragraph}
                    </p>
                  ))}
                </section>
                {post.cta && post.cta.afterSection === index && (
                  <BlogCta
                    slug={post.slug}
                    placement="inline"
                    heading={post.cta.heading}
                    text={post.cta.text}
                    buttonLabel={post.cta.buttonLabel}
                    href={post.cta.href}
                    preview={renderCtaPreview(post.cta.preview)}
                  />
                )}
              </Fragment>
            ))}
          </div>

          <BlogCta
            className="mt-12"
            slug={post.slug}
            placement="end"
            heading="Probeer MyTeamPlanner gratis"
            text="In 2 minuten je team aangemaakt. Geen creditcard nodig."
            buttonLabel="Gratis starten"
            secondaryHref={post.featureLink}
            secondaryLabel={post.featureLabel}
          />
        </div>
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t bg-neutral-50 px-4 py-12">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-lg font-bold text-neutral-900">Meer artikelen</h2>
            <div className="mt-6 grid gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group flex items-start justify-between gap-4 rounded-xl border border-neutral-100 bg-white p-4 transition-shadow hover:shadow-sm"
                >
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-primary-600">
                      {related.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                      {related.description}
                    </p>
                  </div>
                  <ArrowRight className="mt-0.5 size-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
