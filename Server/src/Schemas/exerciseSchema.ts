import { z } from 'zod';
import { ExerciseCategory } from '@prisma/client';

export const exerciseSchema = z.object({
  Name: z
    .string()
    .max(20, 'Name must be at most 20 characters long')
    .regex(/^[a-zA-Z0-9 ]+$/, 'Name must be alphanumeric and may include spaces'),
  category: z.nativeEnum(ExerciseCategory),
  is_bodyweight: z.boolean(),
  equipment: z.string().optional(),
});
