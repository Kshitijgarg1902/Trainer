import { configureStore } from '@reduxjs/toolkit';
import Templatereducer from './Template/TemplateSlice';
import ExerciseReducer from './Exercise/ExerciseSlice';
import WorkoutReducer from './Workout/WorkoutSlice';
import UserReducer from './User/UserSlice';

export const store = configureStore({
  reducer: {
    template: Templatereducer,
    exercise: ExerciseReducer,
    workout: WorkoutReducer,
    user: UserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
