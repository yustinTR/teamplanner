import { FORMAT_PAGES } from "@/lib/format-pages";
import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import {
  AGE_GROUPS,
  EXERCISES_BASE_PATH,
  exercisePath,
  getPublishedExercises,
} from "@/lib/public-exercises";

const siteUrl = "https://www.myteamplanner.nl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const exercises = await getPublishedExercises();
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
      url: `${siteUrl}/account-verwijderen`,
      lastModified: "2026-10-23",
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${siteUrl}/tools/wisselschema`,
      lastModified: "2026-11-09",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/tools/opstelling`,
      lastModified: "2026-11-09",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...FORMAT_PAGES.flatMap((p) =>
      ["wisselschema", "opstelling"].map((tool) => ({
        url: `${siteUrl}/tools/${tool}/${p.slug}`,
        lastModified: "2026-11-09",
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }))
    ),
    {
      url: `${siteUrl}${EXERCISES_BASE_PATH}`,
      lastModified: "2026-11-09",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...AGE_GROUPS.map((g) => ({
      url: `${siteUrl}${EXERCISES_BASE_PATH}/leeftijd/${g.slug}`,
      lastModified: "2026-11-09",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...exercises.map((e) => ({
      url: `${siteUrl}${exercisePath(e.title)}`,
      lastModified: e.updated_at.slice(0, 10),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: `${siteUrl}/android`,
      lastModified: "2026-10-25",
      changeFrequency: "monthly",
      priority: 0.5,
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
