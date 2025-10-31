import { WorkoutLog } from '@prisma/client';
import {
  addUserWorkout,
  deleteUserWorkout,
  getUserWorkouts,
  updateUserWorkout,
} from '../Services/workoutService';
import { newWorkoutLog, workoutLog } from '../types/workout';

export const getAllworkouts = async (userID: number): Promise<WorkoutLog[]> => {
  return await getUserWorkouts(userID);
};

export const addWorkout = async (userID: number, workoutData: newWorkoutLog): Promise<void> => {
  await addUserWorkout(userID, workoutData);
};

export const updateWorkout = async (userID: number, workoutData: workoutLog): Promise<void> => {
  await updateUserWorkout(userID, workoutData);
};

export const deleteWorkout = async (userID: number, workoutID: number): Promise<void> => {
  await deleteUserWorkout(userID, workoutID);
};
