import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../services/axios';
import { User } from '../../types/Usertypes';

type UserData = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: UserData = {
  user: null,
  isLoading: false,
  error: null,
};

export const getUserData = createAsyncThunk('getUserData', async () => {
  const response = await API.get('user/getUserData');
  if (response.status < 200 || response.status >= 300) {
    throw new Error('Failed to fetch User Data');
  }

  return response.data;
});

const UserSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserData.pending, (state) => {
        state.isLoading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        state.error = null;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.error.message || 'Failed to fetch User Data';
      });
  },
});

export const UserActions = UserSlice.actions;
export default UserSlice.reducer;
