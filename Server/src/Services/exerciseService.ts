import { Exercise } from '@prisma/client';
import { exercise } from '../types/exercise';
import {
  addnewExerciseinDB,
  checkExercisesinDb,
  checkifExerciseExistsinDB,
  deleteExercisesinDB,
  getAllExercisesDatainDB,
  getdefaultExercisesinDB,
  getUserExerciesinDB,
} from '../Repositories/exerciseRepository';
import { AppError } from '../types/error';

export const checkexerciseIds = async (exerciseIds: number[]): Promise<void> => {
  if (!Array.isArray(exerciseIds) || exerciseIds.length === 0) {
    throw new AppError('exerciseIds must be a non-empty array', 400);
  }

  const exercises = await checkExercisesinDb(exerciseIds);

  if (exercises.length !== exerciseIds.length) {
    throw new AppError('One or more exercise IDs do not exist in the database', 400);
  }
};

export const getAllExercises = async (userId: number): Promise<Exercise[]> => {
  const defaultExercises = await getdefaultExercisesinDB();

  const userExercises = await getUserExerciesinDB(userId);

  const exercises = [...defaultExercises, ...userExercises];

  return exercises;
};

export const checkifExerciseExists = async (
  exerciseName: string,
  userId: number
): Promise<Boolean> => {
  const exercise = await checkifExerciseExistsinDB(exerciseName, userId);

  if (exercise !== null && exercise !== undefined) {
    return true;
  }

  return false;
};

export const addnewExercise = async (exercise: exercise, userId: number): Promise<void> => {
  await addnewExerciseinDB(exercise, userId);
};

export const deleteExercises = async (exerciseId: number, userId: number): Promise<void> => {
  await deleteExercisesinDB(exerciseId, userId);
};

export const getAllExercisesData = async (userId: number): Promise<Exercise[]> => {
  const exercisesData = await getAllExercisesDatainDB(userId);

  if (!exercisesData || exercisesData.length === 0) {
    throw new AppError('No exercises found for the user', 404);
  }

  return exercisesData;
};
