import { Template } from '@prisma/client';
import { checkexerciseIds } from '../Services/exerciseService';
import {
  getTemplates,
  saveUserTemplate,
  updateUserTemplate,
  removeUserTemplate,
} from '../Services/templateService';
import { workoutTemplate } from '../types/workout';

export const getUserTemplates = async (userid: number): Promise<Template[]> => {
  return await getTemplates(userid);
};

export const postUserTemplate = async (
  userid: number,
  template: workoutTemplate
): Promise<void> => {
  const exerciseid = template.exercises.map((exercise: any) => exercise.exerciseId);

  await checkexerciseIds(exerciseid);

  await saveUserTemplate(userid, template);
};

export const putUserTemplate = async (
  userid: number,
  template: workoutTemplate,
  templateId: number
): Promise<void> => {
  const exerciseid = template.exercises.map((exercise: any) => exercise.exerciseId);

  await checkexerciseIds(exerciseid);

  await updateUserTemplate(userid, template, templateId);
};

export const deleteUserTemplate = async (userid: number, templateId: number): Promise<void> => {
  await removeUserTemplate(userid, templateId);
};
