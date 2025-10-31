import { Exercise } from '@prisma/client';
import prisma from '../db';
import { exercise } from '../types/exercise';

export const checkExercisesinDb = async (exerciseId: number[]) => {
  return await prisma.exercise.findMany({
    where: {
      id: {
        in: exerciseId,
      },
    },
  });
};

export const getdefaultExercisesinDB = async () => {
  return await prisma.exercise.findMany({
    where: {
      userId: 0,
    },
  });
};

export const getUserExerciesinDB = async (userId: number) => {
  return await prisma.exercise.findMany({
    where: {
      userId: userId,
    },
  });
};

export const checkifExerciseExistsinDB = async (exerciseName: string, userId: number) => {
  await prisma.exercise.findFirst({
    where: {
      name: {
        equals: exerciseName,
        mode: 'insensitive',
      },
      userId: {
        in: [0, userId],
      },
    },
  });
};

export const addnewExerciseinDB = async (exercise: exercise, userId: number) => {
  await prisma.exercise.create({
    data: {
      name: exercise.name,
      category: exercise.category,
      equipment: exercise.equipment,
      userId: userId,
    },
  });
};

export const deleteExercisesinDB = async (exerciseId: number, userId: number) => {
  await prisma.exercise.delete({
    where: {
      id: exerciseId,
      userId: userId,
    },
  });
};

export const getAllExercisesDatainDB = async (userId: number): Promise<Exercise[]> => {
  return await prisma.exercise.findMany({
    where: {
      OR: [{ userId }, { userId: 0 }],
    },
    include: {
      exercise_logs: {
        where: { workoutlog: { userId } },
        orderBy: { created_at: 'desc' },
        take: 1,
        include: {
          sets: {
            orderBy: { set_number: 'asc' },
          },
        },
      },
    },
  });
};
