import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { blogPosts, getBlogPost, getAllSlugs } from "@/lib/blog";

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
      canonical: `https://myteamplanner.nl/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://myteamplanner.nl/blog/${post.slug}`,
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

  // Find related posts (other posts, max 3)
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `https://myteamplanner.nl/blog/${post.slug}`,
    inLanguage: "nl",
    author: {
      "@type": "Organization",
      name: "MyTeamPlanner",
      url: "https://myteamplanner.nl",
    },
    publisher: {
      "@type": "Organization",
      name: "MyTeamPlanner",
      url: "https://myteamplanner.nl",
      logo: {
        "@type": "ImageObject",
        url: "https://myteamplanner.nl/icons/icon-192x192.svg",
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
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-neutral-900"
          >
            <ArrowLeft className="size-4" />
            Alle artikelen
          </Link>

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
            {post.sections.map((section) => (
              <section key={section.heading}>
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
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-primary-50 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-neutral-900">
              Probeer MyTeamPlanner gratis
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              In 2 minuten je team aangemaakt. Geen creditcard nodig.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
              >
                Gratis starten
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={post.featureLink}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                {post.featureLabel}
              </Link>
            </div>
          </div>
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
