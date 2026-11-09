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

  it("fills eight positions (8 v 8) for the whole match", () => {
    const total = playerMinutes.reduce((sum, p) => sum + p.totalMinutes, 0);
    expect(total).toBe(8 * totalMinutes);
  });

  it("has eight outfield players on 48 minutes and one on 36, as the article says", () => {
    const outfield = playerMinutes.filter((p) => p.totalMinutes < totalMinutes).map((p) => p.totalMinutes);
    expect(outfield.filter((m) => m === 48)).toHaveLength(8);
    expect(outfield.filter((m) => m === 36)).toHaveLength(1);
  });

  it("matches each player's periods to their minutes", () => {
    for (const p of playerMinutes) {
      const fromPeriods = p.periods.reduce((sum, r) => sum + (r.end - r.start), 0);
      expect(fromPeriods, p.name).toBe(p.totalMinutes);
    }
  });
});
