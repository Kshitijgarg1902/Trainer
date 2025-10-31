import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { WorkoutTemplate } from '../../types/Templatetypes';
import API from '../../services/axios';

type TemplateState = {
  templates: WorkoutTemplate[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TemplateState = {
  templates: [],
  isLoading: false,
  error: null,
};

export const fetchTemplates = createAsyncThunk('fetchTemplates', async () => {
  const response = await API.get('template/getTemplates');
  if (response.status < 200 || response.status >= 300) {
    throw new Error('Failed to fetch templates');
  }

  return response.data;
});

const TemplateSlice = createSlice({
  name: 'template',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.isLoading = true;
        state.templates = [];
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload.data.map((x: any) => {
          return { id: x.id, templateData: x.template };
        });
        state.error = null;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.templates = [];
        state.error = action.error.message || 'Failed to fetch templates';
      });
  },
});

export const TemplateActions = TemplateSlice.actions;
export default TemplateSlice.reducer;
