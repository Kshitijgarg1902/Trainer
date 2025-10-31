import { z } from 'zod';

const setTypeEnum = z.enum(['W', 'F', 'N']);

const setTemplateSchema = z.object({
  type: setTypeEnum,
});

const exerciseTemplateSchema = z.object({
  exerciseName: z.string(),
  sets: z.array(setTemplateSchema).refine((obj) => Object.keys(obj).length > 0, {
    message: 'Exercises object must not be empty',
  }),
});

export const workoutTemplateSchema = z.object({
  id: z.number().int(),
  templateData: z.object({
    name: z.string().min(1, 'Template name must not be empty'),
    exercises: z.array(exerciseTemplateSchema).min(1, 'At least one exercise is required'),
  }),
});

export const newWorkoutTemplateSchema = z.object({
  templateData: z.object({
    name: z.string().min(1, 'Template name must not be empty'),
    exercises: z.array(exerciseTemplateSchema).min(1, 'At least one exercise is required'),
  }),
});
