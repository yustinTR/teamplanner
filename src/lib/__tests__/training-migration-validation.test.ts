import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const migrationSql = readFileSync(
  resolve(__dirname, "../../../supabase/migrations/20260226100000_create_exercises_tables.sql"),
  "utf-8"
);

describe("Exercises migration SQL validation", () => {
  describe("enums", () => {
    it("creates exercise_category enum with all 7 values", () => {
      expect(migrationSql).toContain("create type public.exercise_category as enum");
      const categories = ["warming_up", "passing", "positiespel", "verdedigen", "aanvallen", "conditie", "afwerken"];
      for (const cat of categories) {
        expect(migrationSql).toContain(`'${cat}'`);
      }
    });

    it("creates exercise_difficulty enum with 3 levels", () => {
      expect(migrationSql).toContain("create type public.exercise_difficulty as enum");
      expect(migrationSql).toContain("'basis'");
      expect(migrationSql).toContain("'gemiddeld'");
      expect(migrationSql).toContain("'gevorderd'");
    });
  });

  describe("exercises table", () => {
    it("creates the exercises table", () => {
      expect(migrationSql).toContain("create table public.exercises");
    });

    it("has all required columns", () => {
      const columns = [
        "id uuid primary key",
        "title text not null",
        "description text not null",
        "category public.exercise_category not null",
        "difficulty public.exercise_difficulty",
        "team_types text[]",
        "min_players int",
        "max_players int",
        "duration_minutes int not null",
        "setup_instructions text",
        "variations text",
        "video_url text",
        "is_published boolean",
      ];
      for (const col of columns) {
        expect(migrationSql, `Missing column: ${col}`).toContain(col);
      }
    });

    it("has indexes on category and is_published", () => {
      expect(migrationSql).toContain("idx_exercises_category");
      expect(migrationSql).toContain("idx_exercises_is_published");
    });

    it("has RLS enabled", () => {
      expect(migrationSql).toContain("alter table public.exercises enable row level security");
    });

    it("has a select policy for published exercises", () => {
      expect(migrationSql).toContain("is_published = true");
    });

    it("has an updated_at trigger", () => {
      expect(migrationSql).toContain("on_exercises_updated");
      expect(migrationSql).toContain("handle_updated_at()");
    });
  });

  describe("training_plans table", () => {
    it("creates the training_plans table", () => {
      expect(migrationSql).toContain("create table public.training_plans");
    });

    it("has team_id FK with CASCADE delete", () => {
      expect(migrationSql).toMatch(/training_plans[\s\S]*?team_id uuid not null references public\.teams\(id\) on delete cascade/);
    });

    it("has optional event_id FK with SET NULL", () => {
      expect(migrationSql).toMatch(/event_id uuid references public\.events\(id\) on delete set null/);
    });

    it("has created_by FK to auth.users", () => {
      expect(migrationSql).toMatch(/training_plans[\s\S]*?created_by uuid not null references auth\.users/);
    });

    it("has index on team_id", () => {
      expect(migrationSql).toContain("idx_training_plans_team_id");
    });

    it("has RLS enabled", () => {
      expect(migrationSql).toContain("alter table public.training_plans enable row level security");
    });

    it("has coach manage policy", () => {
      expect(migrationSql).toContain("Coach can manage training plans");
    });

    it("has player view policy", () => {
      expect(migrationSql).toContain("Players can view training plans");
    });

    it("has an updated_at trigger", () => {
      expect(migrationSql).toContain("on_training_plans_updated");
    });
  });

  describe("training_plan_exercises table", () => {
    it("creates the training_plan_exercises table", () => {
      expect(migrationSql).toContain("create table public.training_plan_exercises");
    });

    it("has plan_id FK with CASCADE delete", () => {
      expect(migrationSql).toMatch(/plan_id uuid not null references public\.training_plans\(id\) on delete cascade/);
    });

    it("has exercise_id FK with RESTRICT delete", () => {
      expect(migrationSql).toMatch(/exercise_id uuid not null references public\.exercises\(id\) on delete restrict/);
    });

    it("has sort_order with unique constraint", () => {
      expect(migrationSql).toContain("sort_order int not null");
      expect(migrationSql).toContain("unique (plan_id, sort_order)");
    });

    it("has index on plan_id", () => {
      expect(migrationSql).toContain("idx_training_plan_exercises_plan_id");
    });

    it("has RLS enabled", () => {
      expect(migrationSql).toContain("alter table public.training_plan_exercises enable row level security");
    });

    it("has coach manage policy", () => {
      expect(migrationSql).toContain("Coach can manage training plan exercises");
    });

    it("has player view policy", () => {
      expect(migrationSql).toContain("Players can view training plan exercises");
    });
  });
});
