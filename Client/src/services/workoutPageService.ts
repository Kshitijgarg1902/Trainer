import { useRef } from 'react';
import { AppDispatch } from '../store/store';
import { getUserWorkouts } from '../store/Workout/WorkoutSlice';
import { newWorkout, WorkoutLog } from '../types/Workouttypes';
import API from './axios';
import { useNavigate } from 'react-router';
import { getUserData } from '../store/User/UserSlice';
import { fetchExerciseData } from '../store/Exercise/ExerciseSlice';

export const updateWorkout = async (
  workout: WorkoutLog,
  dispatch: AppDispatch,
  setIsBusy: (busy: boolean) => void,
  setErrorPopup: (errorPopup: boolean) => void,
) => {
  setIsBusy(true);
  try {
    await API.put('/workout/updateWorkout', workout);
    dispatch(getUserWorkouts());
    dispatch(fetchExerciseData());
    setIsBusy(false);
  } catch {
    setErrorPopup(true);
    setIsBusy(false);
  }
};

export const removeWorkout = async (
  workout: WorkoutLog,
  setWorkout: (workout: WorkoutLog | null) => void,
  setIsBusy: (busy: boolean) => void,
  dispatch: AppDispatch,
  setErrorPopup: (errorPopup: boolean) => void,
) => {
  setIsBusy(true);
  try {
    await API.delete(`/workout/deleteWorkout/${workout.id}`);
    dispatch(getUserWorkouts());
    dispatch(getUserData());
    dispatch(fetchExerciseData());
    setWorkout(null);
    setIsBusy(false);
  } catch {
    setErrorPopup(true);
    setIsBusy(false);
  }
};

export const addWorkout = async (
  newWorkout: newWorkout,
  setIsBusy: (busy: boolean) => void,
  setErrorPopup: (errorPopup: boolean) => void,
  dispatch: AppDispatch,
  timerRef: ReturnType<typeof useRef<number>>,
  navigate: ReturnType<typeof useNavigate>,
) => {
  setIsBusy(true);

  newWorkout.exerciseslog = newWorkout.exerciseslog
    .map((exerciselog) => {
      const filteredSets = exerciselog.sets.filter((set) => set.checked);
      return {
        ...exerciselog,
        sets: filteredSets,
      };
    })
    .filter((exerciselog) => exerciselog.sets.length > 0);

  const duration_minutes =
    Math.floor(timerRef.current! / 60) == 0
      ? 1
      : Math.floor(timerRef.current! / 60);

  newWorkout.duration_minutes = duration_minutes;
  try {
    await API.post('/workout/addWorkout/', newWorkout);
    dispatch(getUserWorkouts());
    dispatch(getUserData());
    dispatch(fetchExerciseData());
    setIsBusy(false);
    navigate('/workouts');
  } catch {
    setErrorPopup(true);
    setIsBusy(false);
  }
};
