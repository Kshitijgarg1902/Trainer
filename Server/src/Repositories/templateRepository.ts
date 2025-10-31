import prisma from '../db';
import { workoutTemplate } from '../types/workout';

export const getTemplatesinDB = async (userId: number) => {
  return await prisma.template.findMany({
    where: {
      OR: [{ userId: userId }, { userId: 0 }],
    },
    orderBy: {
      created_at: 'desc',
    },
  });
};

export const saveUserTemplateInDB = async (userid: number, template: workoutTemplate) => {
  return await prisma.template.create({
    data: {
      userId: userid,
      template: template,
    },
  });
};

export const updateUserTemplateInDB = async (
  userid: number,
  template: workoutTemplate,
  templateId: number
) => {
  return await prisma.template.update({
    where: {
      id: templateId,
      userId: userid,
    },
    data: {
      template: template,
    },
  });
};

export const removeUserTemplateInDB = async (userid: number, templateId: number) => {
  return await prisma.template.delete({
    where: {
      id: templateId,
      userId: userid,
    },
  });
};
