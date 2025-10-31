import { ExerciseLog, newExerciseLog } from './Exercisetypes';

export interface WorkoutLog {
  id: number;
  userId: number;
  created_at: string;
  duration_minutes: number;
  notes: string | null;
  exerciseslog: ExerciseLog[];
}

export interface newWorkout {
  duration_minutes: number;
  notes: string | null;
  exerciseslog: newExerciseLog[];
}
