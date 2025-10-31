import { WorkoutLog } from '@prisma/client';
import {
  addUserWorkoutinDB,
  deleteUserWorkoutinDB,
  getUserWorkoutsinDB,
  updateWorkoutInDB,
} from '../Repositories/workoutRepository';
import { newWorkoutLog, workoutLog } from '../types/workout';

export const getUserWorkouts = async (userID: number): Promise<WorkoutLog[]> => {
  return await getUserWorkoutsinDB(userID);
};

export const addUserWorkout = async (userID: number, workoutData: newWorkoutLog): Promise<void> => {
  await addUserWorkoutinDB(userID, workoutData);
};

export const updateUserWorkout = async (userID: number, workoutData: workoutLog): Promise<void> => {
  await updateWorkoutInDB(userID, workoutData);
};

export const deleteUserWorkout = async (userID: number, workoutID: number): Promise<void> => {
  await deleteUserWorkoutinDB(userID, workoutID);
};
