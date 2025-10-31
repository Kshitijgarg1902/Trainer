import { Router } from 'express';
import { catchAsync } from '../Util/catchAsync';
import {
  // AddExerciseController,
  deleteExerciseController,
  fetchAllExercisesData,
  fetchExercisesController,
} from '../Controllers/exerciseController';
import validate from '../Middlewares/validationMiddleWare';
import { exerciseSchema } from '../Schemas/exerciseSchema';
import { exercise } from '../types/exercise';

const exerciseRouter = Router();

exerciseRouter.get(
  '/fetchExercises',
  catchAsync(async (req, res) => {
    const userId = req.user!.userId;

    const exercises = await fetchExercisesController(userId);

    res.status(200).json({
      status: true,
      message: 'Fetched exercises successfully',
      data: {
        exercises: exercises,
      },
    });
  })
);

// exerciseRouter.post(
//   '/createExercise',
//   validate({ body: exerciseSchema }),
//   catchAsync(async (req, res) => {
//     const userId = req.user!.userId;

//     const newExercise: exercise = exerciseSchema.parse(req.body) as exercise;

//     await AddExerciseController(newExercise, userId);

//     res.status(201).json({
//       status: true,
//       message: 'Exercise created successfully',
//     });
//   })
// );

exerciseRouter.delete(
  '/deleteExercise/:exerciseId',
  catchAsync(async (req, res) => {
    const userId = req.user!.userId;
    const exerciseId = parseInt(req.params.exerciseId, 10);

    await deleteExerciseController(exerciseId, userId);

    res.status(200).json({
      status: true,
      message: 'Exercise deleted successfully',
    });
  })
);

exerciseRouter.get(
  '/fetchAllExercisesData',
  catchAsync(async (req, res) => {
    const userId = req.user!.userId;

    const exercises = await fetchAllExercisesData(userId);

    res.status(200).json({
      status: true,
      message: 'Fetched exercises Data successfully',
      data: {
        exercises,
      },
    });
  })
);

exerciseRouter;

export default exerciseRouter;
