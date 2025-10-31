import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../services/axios';
import { ExerciseData } from '../../types/Exercisetypes';

type ExerciseState = {
  exercises: ExerciseData[];
  isLoading: boolean;
  error: string | null;
};

const initialState: ExerciseState = {
  exercises: [],
  isLoading: false,
  error: null,
};

export const fetchExerciseData = createAsyncThunk(
  'fetchExerciseData',
  async () => {
    const response = await API.get('exercise/fetchAllExercisesData');
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Failed to fetch exercise data');
    }

    return response.data;
  },
);

const ExerciseSlice = createSlice({
  name: 'exercise',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExerciseData.pending, (state) => {
        state.isLoading = true;
        state.exercises = [];
        state.error = null;
      })
      .addCase(fetchExerciseData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exercises = action.payload.data.exercises;
        state.error = null;
      })
      .addCase(fetchExerciseData.rejected, (state, action) => {
        state.isLoading = false;
        state.exercises = [];
        state.error = action.error.message || 'Failed to fetch templates';
      });
  },
});

export const ExerciseActions = ExerciseSlice.actions;
export default ExerciseSlice.reducer;
