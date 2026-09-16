import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";

const siteUrl = "https://www.myteamplanner.nl";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestPostDate = blogPosts
    .map((post) => post.date)
    .sort()
    .at(-1);

  return [
    {
      url: siteUrl,
      lastModified: "2026-09-14",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/voorwaarden`,
      lastModified: "2026-02-19",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: "2026-02-19",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/features/beschikbaarheid`,
      lastModified: "2026-03-13",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/features/opstellingen`,
      lastModified: "2026-03-13",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/features/wedstrijden`,
      lastModified: "2026-03-13",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/features/trainingen`,
      lastModified: "2026-03-13",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
