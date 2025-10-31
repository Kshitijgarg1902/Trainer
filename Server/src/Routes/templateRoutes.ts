import { Router } from 'express';
import { catchAsync } from '../Util/catchAsync';
import {
  deleteUserTemplate,
  getUserTemplates,
  postUserTemplate,
  putUserTemplate,
} from '../Controllers/templateController';
import validate from '../Middlewares/validationMiddleWare';
import { workoutTemplateSchema, newWorkoutTemplateSchema } from '../Schemas/templateSchema';

const templateRouter = Router();

templateRouter.get(
  '/getTemplates',
  catchAsync(async (req, res) => {
    const userId = req.user!.userId;

    const templates = await getUserTemplates(userId);

    res
      .status(200)
      .json({ status: true, data: templates, message: 'Templates fetched successfully' });
  })
);

templateRouter.post(
  '/createTemplate',
  validate({ body: newWorkoutTemplateSchema }),
  catchAsync(async (req, res) => {
    const userId = req.user!.userId;

    const { templateData } = req.body;

    await postUserTemplate(userId, templateData);

    res.status(200).json({ status: true, message: 'Template Added successfully' });
  })
);

templateRouter.put(
  '/updateTemplate',
  validate({ body: workoutTemplateSchema }),
  catchAsync(async (req, res) => {
    const userId = req.user!.userId;

    const { templateData, id } = req.body;

    await putUserTemplate(userId, templateData, id);

    res.status(200).json({ status: true, message: 'Template Updated successfully' });
  })
);

templateRouter.delete(
  '/deleteTemplate/:templateId',
  catchAsync(async (req, res) => {
    const userId = req.user!.userId;
    const templateId = parseInt(req.params.templateId, 10);

    await deleteUserTemplate(userId, templateId);

    res.status(200).json({ status: true, message: 'Template Deleted successfully' });
  })
);

export default templateRouter;
