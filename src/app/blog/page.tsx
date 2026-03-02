import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Tips voor amateurvoetbalcoaches",
  description:
    "Praktische artikelen over opstellingen, wisselschema's, teambeheer en trainingen voor amateurvoetbalcoaches in Nederland.",
  alternates: {
    canonical: "https://myteamplanner.nl/blog",
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="bg-white px-4 pb-12 pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Tips voor amateurvoetbalcoaches
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Praktische tips en artikelen voor amateurvoetbalcoaches.
            Van opstellingen en wisselschema&apos;s tot teambeheer.
          </p>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                  <span className="text-neutral-300">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {post.readingTime}
                  </span>
                </div>
                <h2 className="mt-2 text-lg font-bold text-neutral-900 group-hover:text-primary-600">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {post.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600">
                  Lees meer
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
