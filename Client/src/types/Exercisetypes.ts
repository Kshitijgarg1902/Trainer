import { newSet, Set } from './Settypes';

export type ExerciseLogData = {
  exerciseId: number;
  notes: string | null;
  sets: Set[];
};

export type ExerciseData = {
  id: number;
  name: string;
  category: ExerciseCategory;
  equipment: string | null;
  exercise_logs: ExerciseLogData[] | null;
};

export interface ExerciseLog {
  notes: string | null;
  exercise: Exercise;
  sets: Set[];
}

export interface Exercise {
  id: number;
  name: string;
  category: ExerciseCategory;
  equipment: string | null;
}

export interface newExerciseLog {
  notes: string | null;
  exercise: Exercise;
  sets: newSet[];
}

export type ExerciseCategory =
  | 'Chest'
  | 'Back'
  | 'Legs'
  | 'Shoulders'
  | 'Biceps'
  | 'Triceps'
  | 'Core';
