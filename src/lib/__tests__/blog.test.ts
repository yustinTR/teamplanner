import { describe, expect, it } from "vitest";
import { blogPosts } from "@/lib/blog";
import { demoSubstitutionPlan } from "@/lib/blog-cta-demo";

describe("blog posts", () => {
  it("places every in-article CTA after an existing section", () => {
    for (const post of blogPosts) {
      if (!post.cta) continue;
      expect(post.cta.afterSection, post.slug).toBeGreaterThanOrEqual(0);
      expect(post.cta.afterSection, post.slug).toBeLessThan(post.sections.length);
    }
  });

  it("only links related slugs that exist", () => {
    const slugs = new Set(blogPosts.map((p) => p.slug));
    for (const post of blogPosts) {
      for (const related of post.relatedSlugs ?? []) {
        expect(slugs.has(related), `${post.slug} -> ${related}`).toBe(true);
      }
    }
  });
});

describe("demo substitution plan", () => {
  const { playerMinutes, totalMinutes } = demoSubstitutionPlan;

  it("fills seven positions for the whole match", () => {
    const total = playerMinutes.reduce((sum, p) => sum + p.totalMinutes, 0);
    expect(total).toBe(7 * totalMinutes);
  });

  it("gives outfield players at most one minute difference, as the article claims", () => {
    const outfield = playerMinutes.filter((p) => p.totalMinutes < totalMinutes);
    const minutes = outfield.map((p) => p.totalMinutes);
    expect(Math.max(...minutes) - Math.min(...minutes)).toBeLessThanOrEqual(1);
  });

  it("matches each player's periods to their minutes", () => {
    for (const p of playerMinutes) {
      const fromPeriods = p.periods.reduce((sum, r) => sum + (r.end - r.start), 0);
      expect(fromPeriods, p.name).toBe(p.totalMinutes);
    }
  });
});
