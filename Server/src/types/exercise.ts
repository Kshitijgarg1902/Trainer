import { SetType } from '@prisma/client';
import { ExerciseCategory } from '@prisma/client';
import { set } from './set';

export type exerciseTemplate = {
  exerciseId: number;
  sets: SetType[];
};

export type exercise = {
  id: number;
  name: string;
  category: ExerciseCategory;
  equipment: string | null;
};

export type exerciseLog = {
  notes: string | null;
  exercise: exercise;
  sets: set[];
};
