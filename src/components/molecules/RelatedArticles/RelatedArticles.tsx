import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

interface RelatedArticlesProps {
  posts: Pick<BlogPost, "slug" | "title" | "description" | "readingTime">[];
  title?: string;
}

/** Internal-linking block for marketing pages: a short list of blog articles. */
export function RelatedArticles({ posts, title = "Lees verder" }: RelatedArticlesProps) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-neutral-50 px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-neutral-900 sm:text-3xl">{title}</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="flex h-full flex-col rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="font-semibold text-neutral-900">{post.title}</h3>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted-foreground">
                  {post.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-700">
                  {post.readingTime} leestijd
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center">
          <Link href="/blog" className="text-sm font-medium text-primary-700 hover:underline">
            Alle artikelen
          </Link>
        </p>
      </div>
    </section>
  );
}
