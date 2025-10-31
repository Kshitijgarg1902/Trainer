import { Router } from 'express';
import { catchAsync } from '../Util/catchAsync';
import {
  addWorkout,
  deleteWorkout,
  getAllworkouts,
  updateWorkout,
} from '../Controllers/workoutController';
import validate from '../Middlewares/validationMiddleWare';
import { newWorkoutLogShcema, workoutLogSchema } from '../Schemas/workoutSchema';

const workoutRouter = Router();

workoutRouter.get(
  '/getWorkouts',
  catchAsync(async (req, res) => {
    const userID = req.user!.userId;

    const workouts = await getAllworkouts(userID);

    res.status(200).json({
      status: true,
      message: 'Workouts retrieved successfully',
      data: workouts,
    });
  })
);

workoutRouter.post(
  '/addWorkout',
  validate({ body: newWorkoutLogShcema }),
  catchAsync(async (req, res) => {
    const userID = req.user!.userId;
    const workoutData = req.body;

    await addWorkout(userID, workoutData);

    res.status(201).json({
      status: true,
      message: 'Workout added successfully',
    });
  })
);

workoutRouter.put(
  '/updateWorkout',
  validate({ body: workoutLogSchema }),
  catchAsync(async (req, res) => {
    const userID = req.user!.userId;
    const workoutData = req.body;

    await updateWorkout(userID, workoutData);

    res.status(200).json({
      status: true,
      message: 'Workout updated successfully',
    });
  })
);

workoutRouter.delete(
  '/deleteWorkout/:workoutId',
  catchAsync(async (req, res) => {
    const userId = req.user!.userId;
    const workoutId = parseInt(req.params.workoutId, 10);

    await deleteWorkout(userId, workoutId);

    res.status(200).json({
      status: true,
      message: 'Workout deleted successfully',
    });
  })
);

export default workoutRouter;
