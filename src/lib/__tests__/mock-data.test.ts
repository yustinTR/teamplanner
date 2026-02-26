import { describe, it, expect } from "vitest";
import {
  createMockExercise,
  createMockTrainingPlan,
  createMockTrainingPlanExercise,
  MOCK_EXERCISES,
  MOCK_TRAINING_PLANS,
} from "../test/mock-data";

describe("createMockExercise", () => {
  it("creates an exercise with default values", () => {
    const exercise = createMockExercise();
    expect(exercise.id).toBeDefined();
    expect(exercise.title).toBe("Rondo 4 tegen 2");
    expect(exercise.category).toBe("warming_up");
    expect(exercise.difficulty).toBe("basis");
    expect(exercise.duration_minutes).toBe(10);
    expect(exercise.is_published).toBe(true);
    expect(exercise.team_types).toContain("senioren");
  });

  it("allows overriding individual fields", () => {
    const exercise = createMockExercise({
      title: "Custom oefening",
      category: "passing",
      difficulty: "gevorderd",
      duration_minutes: 20,
    });
    expect(exercise.title).toBe("Custom oefening");
    expect(exercise.category).toBe("passing");
    expect(exercise.difficulty).toBe("gevorderd");
    expect(exercise.duration_minutes).toBe(20);
  });

  it("generates unique ids when no id is provided", () => {
    const ex1 = createMockExercise();
    const ex2 = createMockExercise();
    expect(ex1.id).not.toBe(ex2.id);
  });

  it("uses provided id when given", () => {
    const exercise = createMockExercise({ id: "my-custom-id" });
    expect(exercise.id).toBe("my-custom-id");
  });

  it("has all required fields present", () => {
    const exercise = createMockExercise();
    const requiredFields = [
      "id", "title", "description", "category", "difficulty",
      "duration_minutes", "is_published", "created_at", "updated_at",
    ];
    for (const field of requiredFields) {
      expect(exercise).toHaveProperty(field);
    }
  });
});

describe("createMockTrainingPlan", () => {
  it("creates a plan with default values", () => {
    const plan = createMockTrainingPlan();
    expect(plan.id).toBeDefined();
    expect(plan.title).toBe("Passing & positiespel");
    expect(plan.team_id).toBe("team-001");
    expect(plan.created_by).toBe("user-coach-001");
    expect(plan.total_duration_minutes).toBe(75);
  });

  it("allows overriding fields", () => {
    const plan = createMockTrainingPlan({
      title: "Conditie training",
      notes: "Hoge intensiteit",
      total_duration_minutes: 90,
    });
    expect(plan.title).toBe("Conditie training");
    expect(plan.notes).toBe("Hoge intensiteit");
    expect(plan.total_duration_minutes).toBe(90);
  });

  it("event_id defaults to null", () => {
    const plan = createMockTrainingPlan();
    expect(plan.event_id).toBeNull();
  });
});

describe("createMockTrainingPlanExercise", () => {
  it("creates a plan exercise with default values", () => {
    const tpe = createMockTrainingPlanExercise();
    expect(tpe.plan_id).toBe("plan-001");
    expect(tpe.exercise_id).toBe("ex-001");
    expect(tpe.sort_order).toBe(0);
  });

  it("allows overriding sort_order", () => {
    const tpe = createMockTrainingPlanExercise({ sort_order: 3 });
    expect(tpe.sort_order).toBe(3);
  });
});

describe("MOCK_EXERCISES", () => {
  it("contains 5 exercises", () => {
    expect(MOCK_EXERCISES).toHaveLength(5);
  });

  it("has exercises from different categories", () => {
    const categories = new Set(MOCK_EXERCISES.map((e) => e.category));
    expect(categories.size).toBeGreaterThanOrEqual(3);
  });

  it("each exercise has a unique id", () => {
    const ids = MOCK_EXERCISES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("MOCK_TRAINING_PLANS", () => {
  it("contains 2 plans", () => {
    expect(MOCK_TRAINING_PLANS).toHaveLength(2);
  });

  it("each plan has a unique id", () => {
    const ids = MOCK_TRAINING_PLANS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all plans belong to team-001", () => {
    for (const plan of MOCK_TRAINING_PLANS) {
      expect(plan.team_id).toBe("team-001");
    }
  });
});
