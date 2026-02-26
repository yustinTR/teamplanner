import type { Tables, TablesInsert, TablesUpdate, Enums } from "@/lib/supabase/types";

export type Exercise = Tables<"exercises">;
export type ExerciseInsert = TablesInsert<"exercises">;

export type ExerciseCategory = Enums<"exercise_category">;
export type ExerciseDifficulty = Enums<"exercise_difficulty">;

export type TrainingPlan = Tables<"training_plans">;
export type TrainingPlanInsert = TablesInsert<"training_plans">;
export type TrainingPlanUpdate = TablesUpdate<"training_plans">;

export type TrainingPlanExercise = Tables<"training_plan_exercises">;
export type TrainingPlanExerciseInsert = TablesInsert<"training_plan_exercises">;

export interface ExerciseFilters {
  category?: ExerciseCategory;
  difficulty?: ExerciseDifficulty;
  teamType?: string;
  maxDuration?: number;
  minPlayers?: number;
  maxPlayers?: number;
}

export interface TrainingPlanExerciseWithExercise extends TrainingPlanExercise {
  exercises: Exercise;
}

export interface TrainingPlanWithExercises extends TrainingPlan {
  training_plan_exercises: TrainingPlanExerciseWithExercise[];
}
