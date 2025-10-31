import { exerciseLog, exerciseTemplate } from './exercise';

export type workoutTemplate = {
  templateName: string;
  exercises: exerciseTemplate[];
};

export type workoutLog = {
  id: number;
  userId: number;
  created_at: string;
  duration_minutes: number;
  notes: string | null;
  exerciseslog: exerciseLog[];
};

export type newWorkoutLog = {
  duration_minutes: number;
  notes: string | null;
  exerciseslog: exerciseLog[];
};
