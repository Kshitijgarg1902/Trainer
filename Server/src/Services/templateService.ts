import { Template } from '@prisma/client';
import {
  getTemplatesinDB,
  saveUserTemplateInDB,
  updateUserTemplateInDB,
  removeUserTemplateInDB,
} from '../Repositories/templateRepository';
import { workoutTemplate } from '../types/workout';

export const getTemplates = async (userid: number): Promise<Template[]> => {
  return await getTemplatesinDB(userid);
};

export const saveUserTemplate = async (
  userid: number,
  template: workoutTemplate
): Promise<void> => {
  await saveUserTemplateInDB(userid, template);
};

export const updateUserTemplate = async (
  userid: number,
  template: workoutTemplate,
  templateId: number
): Promise<void> => {
  await updateUserTemplateInDB(userid, template, templateId);
};

export const removeUserTemplate = async (userid: number, templateId: number): Promise<void> => {
  await removeUserTemplateInDB(userid, templateId);
};
