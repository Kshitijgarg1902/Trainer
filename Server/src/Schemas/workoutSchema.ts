import { z } from 'zod';
import { ExerciseCategory } from '@prisma/client';

const setTypeEnum = z.enum(['W', 'F', 'N']);

const setSchema = z.object({
  reps: z.number().int(),
  weight: z.number(),
  type: setTypeEnum,
});

const exerciseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim(),
  category: z.nativeEnum(ExerciseCategory),
  equipment: z.string().nullable().optional(),
});

const exerciseLogSchema = z.object({
  exercise: exerciseSchema,
  notes: z.string().max(500).nullable().optional(),
  sets: z.array(setSchema).nonempty(),
});

export const workoutLogSchema = z.object({
  id: z.number().int().positive(),
  duration_minutes: z.number().int().positive(),
  notes: z.string().max(1000).nullable().optional(),
  exerciseslog: z.array(exerciseLogSchema).nonempty(),
});

export const newWorkoutLogShcema = z.object({
  duration_minutes: z.number().int().positive(),
  notes: z.string().max(1000).nullable().optional(),
  exerciseslog: z.array(exerciseLogSchema).nonempty(),
});
