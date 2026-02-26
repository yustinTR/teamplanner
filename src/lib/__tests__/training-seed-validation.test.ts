import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

// Parse both seed SQL files to validate exercise coverage
const seedSql1 = readFileSync(
  resolve(__dirname, "../../../supabase/migrations/20260226100001_seed_exercises.sql"),
  "utf-8"
);
const seedSql2 = readFileSync(
  resolve(__dirname, "../../../supabase/migrations/20260226113221_add_more_exercises.sql"),
  "utf-8"
);
const seedSql = seedSql1 + "\n" + seedSql2;

// Extract all exercise titles from the SQL
function extractTitles(sql: string): string[] {
  const titles: string[] = [];
  // Match the title field (first text after "values" opening paren, after newline)
  const insertBlocks = sql.split(/insert into public\.exercises/i).slice(1);
  for (const block of insertBlocks) {
    const valueMatches = block.matchAll(/\(\s*\n\s*'([^']+)'/g);
    for (const match of valueMatches) {
      titles.push(match[1]);
    }
  }
  return titles;
}

// Extract categories from the SQL comments
function extractCategoriesFromSql(sql: string): string[] {
  const categories: string[] = [];
  const matches = sql.matchAll(/'(warming_up|passing|positiespel|verdedigen|aanvallen|conditie|afwerken)'/g);
  for (const match of matches) {
    if (!categories.includes(match[1])) {
      categories.push(match[1]);
    }
  }
  return categories;
}

// Count exercises per category
function countByCategory(sql: string): Record<string, number> {
  const counts: Record<string, number> = {};
  const allCategories = [
    "warming_up", "passing", "positiespel", "verdedigen", "aanvallen", "conditie", "afwerken",
  ];
  for (const cat of allCategories) {
    // Count occurrences as category values (not in comments)
    const regex = new RegExp(`'${cat}',\\s*'(basis|gemiddeld|gevorderd)'`, "g");
    counts[cat] = [...sql.matchAll(regex)].length;
  }
  return counts;
}

// Extract team types from exercises
function extractTeamTypes(sql: string): string[] {
  const types = new Set<string>();
  const matches = sql.matchAll(/\{([^}]+)\}/g);
  for (const match of matches) {
    const items = match[1].split(",");
    for (const item of items) {
      types.add(item.trim());
    }
  }
  return [...types];
}

describe("Seed exercise SQL validation (all migrations combined)", () => {
  const titles = extractTitles(seedSql);
  const categoryCounts = countByCategory(seedSql);
  const teamTypes = extractTeamTypes(seedSql);

  it("contains approximately 79 exercises total", () => {
    const totalExercises = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
    expect(totalExercises).toBeGreaterThanOrEqual(75);
    expect(totalExercises).toBeLessThanOrEqual(85);
  });

  it("covers all 7 exercise categories", () => {
    const usedCategories = extractCategoriesFromSql(seedSql);
    expect(usedCategories).toContain("warming_up");
    expect(usedCategories).toContain("passing");
    expect(usedCategories).toContain("positiespel");
    expect(usedCategories).toContain("verdedigen");
    expect(usedCategories).toContain("aanvallen");
    expect(usedCategories).toContain("conditie");
    expect(usedCategories).toContain("afwerken");
  });

  it("has at least 8 exercises per category", () => {
    for (const [category, count] of Object.entries(categoryCounts)) {
      expect(count, `${category} has ${count} exercises`).toBeGreaterThanOrEqual(8);
    }
  });

  it("warming_up has 10 exercises", () => {
    expect(categoryCounts.warming_up).toBe(10);
  });

  it("passing has 15 exercises", () => {
    expect(categoryCounts.passing).toBe(15);
  });

  it("positiespel has 12 exercises", () => {
    expect(categoryCounts.positiespel).toBe(12);
  });

  it("verdedigen has 10 exercises", () => {
    expect(categoryCounts.verdedigen).toBe(10);
  });

  it("aanvallen has 10 exercises", () => {
    expect(categoryCounts.aanvallen).toBe(10);
  });

  it("conditie has 10 exercises", () => {
    expect(categoryCounts.conditie).toBe(10);
  });

  it("afwerken has 12 exercises", () => {
    expect(categoryCounts.afwerken).toBe(12);
  });

  it("covers all team types", () => {
    expect(teamTypes).toContain("senioren");
    expect(teamTypes).toContain("jo19_jo17");
    expect(teamTypes).toContain("jo15_jo13");
    expect(teamTypes).toContain("jo11_jo9");
    expect(teamTypes).toContain("g_team");
  });

  it("has exercises for youth teams (pupillen)", () => {
    const youthMatches = seedSql.match(/jo11_jo9/g);
    const gTeamMatches = seedSql.match(/g_team/g);
    expect(youthMatches!.length).toBeGreaterThanOrEqual(10);
    expect(gTeamMatches!.length).toBeGreaterThanOrEqual(10);
  });

  it("all exercises are published", () => {
    const falsePublished = seedSql.match(/is_published.*false/gi);
    expect(falsePublished).toBeNull();
  });

  it("has exercises with different difficulty levels", () => {
    const basisCount = [...seedSql.matchAll(/'basis'/g)].length;
    const gemiddeldCount = [...seedSql.matchAll(/'gemiddeld'/g)].length;
    const gevorderdCount = [...seedSql.matchAll(/'gevorderd'/g)].length;
    expect(basisCount).toBeGreaterThanOrEqual(15);
    expect(gemiddeldCount).toBeGreaterThanOrEqual(25);
    expect(gevorderdCount).toBeGreaterThanOrEqual(8);
  });

  it("exercise titles are unique (no duplicates)", () => {
    expect(titles.length).toBe(new Set(titles).size);
  });
});
