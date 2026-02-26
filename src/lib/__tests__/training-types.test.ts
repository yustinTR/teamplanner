import { describe, it, expect } from "vitest";
import type {
  Exercise,
  ExerciseCategory,
  ExerciseDifficulty,
  ExerciseFilters,
  TrainingPlan,
  TrainingPlanExercise,
  TrainingPlanWithExercises,
  TrainingPlanExerciseWithExercise,
} from "@/types";
import { createMockExercise, createMockTrainingPlan, createMockTrainingPlanExercise } from "../test/mock-data";

describe("Exercise type", () => {
  it("has all expected fields", () => {
    const exercise: Exercise = createMockExercise();
    expect(exercise).toHaveProperty("id");
    expect(exercise).toHaveProperty("title");
    expect(exercise).toHaveProperty("description");
    expect(exercise).toHaveProperty("category");
    expect(exercise).toHaveProperty("difficulty");
    expect(exercise).toHaveProperty("team_types");
    expect(exercise).toHaveProperty("min_players");
    expect(exercise).toHaveProperty("max_players");
    expect(exercise).toHaveProperty("duration_minutes");
    expect(exercise).toHaveProperty("setup_instructions");
    expect(exercise).toHaveProperty("variations");
    expect(exercise).toHaveProperty("video_url");
    expect(exercise).toHaveProperty("is_published");
    expect(exercise).toHaveProperty("created_at");
    expect(exercise).toHaveProperty("updated_at");
  });

  it("category field accepts valid enum values", () => {
    const categories: ExerciseCategory[] = [
      "warming_up", "passing", "positiespel", "verdedigen", "aanvallen", "conditie", "afwerken",
    ];
    for (const cat of categories) {
      const exercise = createMockExercise({ category: cat });
      expect(exercise.category).toBe(cat);
    }
  });

  it("difficulty field accepts valid enum values", () => {
    const difficulties: ExerciseDifficulty[] = ["basis", "gemiddeld", "gevorderd"];
    for (const diff of difficulties) {
      const exercise = createMockExercise({ difficulty: diff });
      expect(exercise.difficulty).toBe(diff);
    }
  });

  it("nullable fields can be null", () => {
    const exercise = createMockExercise({
      min_players: null,
      max_players: null,
      setup_instructions: null,
      variations: null,
      video_url: null,
      team_types: null,
    });
    expect(exercise.min_players).toBeNull();
    expect(exercise.max_players).toBeNull();
    expect(exercise.setup_instructions).toBeNull();
    expect(exercise.variations).toBeNull();
    expect(exercise.video_url).toBeNull();
    expect(exercise.team_types).toBeNull();
  });
});

describe("ExerciseFilters type", () => {
  it("allows empty filters", () => {
    const filters: ExerciseFilters = {};
    expect(filters).toEqual({});
  });

  it("allows partial filters", () => {
    const filters: ExerciseFilters = {
      category: "passing",
      maxDuration: 15,
    };
    expect(filters.category).toBe("passing");
    expect(filters.maxDuration).toBe(15);
    expect(filters.difficulty).toBeUndefined();
  });

  it("allows all filter fields", () => {
    const filters: ExerciseFilters = {
      category: "warming_up",
      difficulty: "basis",
      teamType: "senioren",
      maxDuration: 10,
      minPlayers: 6,
      maxPlayers: 12,
    };
    expect(Object.keys(filters)).toHaveLength(6);
  });
});

describe("TrainingPlan type", () => {
  it("has all expected fields", () => {
    const plan: TrainingPlan = createMockTrainingPlan();
    expect(plan).toHaveProperty("id");
    expect(plan).toHaveProperty("team_id");
    expect(plan).toHaveProperty("event_id");
    expect(plan).toHaveProperty("title");
    expect(plan).toHaveProperty("notes");
    expect(plan).toHaveProperty("total_duration_minutes");
    expect(plan).toHaveProperty("created_by");
    expect(plan).toHaveProperty("created_at");
    expect(plan).toHaveProperty("updated_at");
  });
});

describe("TrainingPlanExercise type", () => {
  it("has all expected fields", () => {
    const tpe: TrainingPlanExercise = createMockTrainingPlanExercise();
    expect(tpe).toHaveProperty("id");
    expect(tpe).toHaveProperty("plan_id");
    expect(tpe).toHaveProperty("exercise_id");
    expect(tpe).toHaveProperty("sort_order");
  });
});

describe("TrainingPlanWithExercises type", () => {
  it("extends TrainingPlan with exercises array", () => {
    const plan: TrainingPlanWithExercises = {
      ...createMockTrainingPlan(),
      training_plan_exercises: [
        {
          ...createMockTrainingPlanExercise(),
          exercises: createMockExercise(),
        },
      ],
    };
    expect(plan.training_plan_exercises).toHaveLength(1);
    expect(plan.training_plan_exercises[0].exercises.title).toBe("Rondo 4 tegen 2");
  });

  it("can have empty exercises array", () => {
    const plan: TrainingPlanWithExercises = {
      ...createMockTrainingPlan(),
      training_plan_exercises: [],
    };
    expect(plan.training_plan_exercises).toHaveLength(0);
  });
});

describe("TrainingPlanExerciseWithExercise type", () => {
  it("includes nested exercise data", () => {
    const item: TrainingPlanExerciseWithExercise = {
      ...createMockTrainingPlanExercise(),
      exercises: createMockExercise({ title: "Test Oefening" }),
    };
    expect(item.exercises.title).toBe("Test Oefening");
    expect(item.sort_order).toBe(0);
  });
});
