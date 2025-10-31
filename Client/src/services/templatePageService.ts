import { ViewportEventHandler } from 'framer-motion';
import { AppDispatch } from '../store/store';
import { fetchTemplates } from '../store/Template/TemplateSlice';
import { newWorkoutTemplate, WorkoutTemplate } from '../types/Templatetypes';
import API from './axios';

export const createNewTemplate = async (
  templateData: newWorkoutTemplate,
  dispatch: AppDispatch,
  setisBusy: (isBusy: boolean) => void,
  setPopup: (popUp: boolean) => void,
) => {
  setisBusy(true);
  try {
    await API.post('/template/createTemplate', templateData);
    dispatch(fetchTemplates());
    setisBusy(false);
  } catch {
    setisBusy(false);
    setPopup(true);
  }
};

export const updateTemplate = async (
  templateData: WorkoutTemplate,
  dispatch: AppDispatch,
  setisBusy: (isBusy: boolean) => void,
  setPopup: (popUp: boolean) => void,
) => {
  setisBusy(true);
  try {
    await API.put('/template/updateTemplate', templateData);
    dispatch(fetchTemplates());
    setisBusy(false);
  } catch {
    setisBusy(false);
    setPopup(true);
  }
};

export const deleteTemplate = async (
  templateId: number,
  dispatch: AppDispatch,
  setisBusy: (isBusy: boolean) => void,
  setPopup: (popUp: boolean) => void,
  setDeleteTemplate: (delTemplate: WorkoutTemplate | null) => void,
) => {
  setisBusy(true);
  try {
    await API.delete(`/template/deleteTemplate/${templateId}`);
    dispatch(fetchTemplates());
    setDeleteTemplate(null);
    setisBusy(false);
  } catch {
    setisBusy(false);
    setPopup(true);
  }
};
