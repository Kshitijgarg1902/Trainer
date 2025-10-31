import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../services/axios';
import { WorkoutLog } from '../../types/Workouttypes';

type WorkoutData = {
  workouts: WorkoutLog[];
  isLoading: boolean;
  error: string | null;
};

const initialState: WorkoutData = {
  workouts: [],
  isLoading: false,
  error: null,
};

export const getUserWorkouts = createAsyncThunk('getUserWorkouts', async () => {
  const response = await API.get('workout/getWorkouts');
  if (response.status < 200 || response.status >= 300) {
    throw new Error('Failed to fetch User Workouts');
  }

  return response.data;
});

const WorkoutSlice = createSlice({
  name: 'workout',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserWorkouts.pending, (state) => {
        state.isLoading = true;
        state.workouts = [];
        state.error = null;
      })
      .addCase(getUserWorkouts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workouts = action.payload.data;
        state.error = null;
      })
      .addCase(getUserWorkouts.rejected, (state, action) => {
        state.isLoading = false;
        state.workouts = [];
        state.error = action.error.message || 'Failed to fetch Workouts';
      });
  },
});

export const WorkoutActions = WorkoutSlice.actions;
export default WorkoutSlice.reducer;
