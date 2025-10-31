import { Exercise } from '@prisma/client';
import {
  addnewExercise,
  checkifExerciseExists,
  deleteExercises,
  getAllExercises,
} from '../Services/exerciseService';
import { exercise } from '../types/exercise';
import { AppError } from '../types/error';
import { getAllExercisesData } from '../Services/exerciseService';

export const fetchExercisesController = async (userId: number): Promise<Exercise[]> => {
  return await getAllExercises(userId);
};

// export const AddExerciseController = async (exercise: exercise, userId: number): Promise<void> => {
//   if (userId == 0) throw new AppError('Cannot add default exercises', 403);
//   const check = await checkifExerciseExists(exercise.Name, userId);

//   if (check) throw new AppError(`Exercise with name "${exercise.Name}" already exists`, 400);

//   await addnewExercise(exercise, userId);
// };

export const deleteExerciseController = async (
  exerciseId: number,
  userId: number
): Promise<void> => {
  if (userId == 0) throw new AppError('Cannot delete default exercises', 403);
  await deleteExercises(exerciseId, userId);
};

export const fetchAllExercisesData = async (userId: number): Promise<any> => {
  return await getAllExercisesData(userId);
};
