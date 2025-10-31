import prisma from '../db';
import { newWorkoutLog, workoutLog } from '../types/workout';

export const getUserWorkoutsinDB = async (userID: number) => {
  return await prisma.workoutLog.findMany({
    where: {
      userId: userID,
    },
    orderBy: {
      created_at: 'desc',
    },
    include: {
      exerciseslog: {
        orderBy: {
          order: 'asc',
        },
        include: {
          exercise: true,
          sets: {
            orderBy: {
              set_number: 'asc',
            },
          },
        },
      },
    },
  });
};

export const addUserWorkoutinDB = async (userId: number, workout: newWorkoutLog) => {
  await prisma.$transaction(async (tx) => {
    const workoutLogEntry = await tx.workoutLog.create({
      data: {
        userId,
        duration_minutes: workout.duration_minutes,
        notes: workout.notes,
      },
    });

    for (const [order, exercise] of workout.exerciseslog.entries()) {
      const exerciseLog = await tx.exerciseLog.create({
        data: {
          workoutLogId: workoutLogEntry.id,
          exerciseId: exercise.exercise.id,
          notes: exercise.notes,
          order,
        },
      });

      for (const [set_number, set] of exercise.sets.entries()) {
        await tx.set.create({
          data: {
            userId,
            exercise_log_id: exerciseLog.id,
            exerciseId: exercise.exercise.id,
            set_number,
            reps: set.reps,
            weight: set.weight,
            type: set.type,
          },
        });
      }
    }
  });
};

export const updateWorkoutInDB = async (userId: number, workout: workoutLog) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Update WorkoutLog
    await tx.workoutLog.update({
      where: {
        id: workout.id,
        userId,
      },
      data: {
        duration_minutes: workout.duration_minutes,
        notes: workout.notes,
        updated_at: new Date(),
      },
    });

    // Track processed exerciseLog IDs
    const processedExerciseLogIds: number[] = [];

    // 2. Upsert ExerciseLogs and Sets
    for (const [order, exerciseLogInput] of workout.exerciseslog.entries()) {
      const { exercise, notes, sets } = exerciseLogInput;

      // Try to find existing ExerciseLog by workoutLogId + order
      let existingExerciseLog = await tx.exerciseLog.findUnique({
        where: {
          workoutLogId_order: {
            workoutLogId: workout.id,
            order,
          },
        },
      });

      let exerciseLogId: number;

      if (existingExerciseLog) {
        // Update existing ExerciseLog
        await tx.exerciseLog.update({
          where: {
            id: existingExerciseLog.id,
          },
          data: {
            exerciseId: exercise.id,
            notes,
            updated_at: new Date(),
          },
        });
        exerciseLogId = existingExerciseLog.id;
      } else {
        // Create new ExerciseLog
        const newLog = await tx.exerciseLog.create({
          data: {
            workoutLogId: workout.id,
            exerciseId: exercise.id,
            notes,
            order,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
        exerciseLogId = newLog.id;
      }

      processedExerciseLogIds.push(exerciseLogId);

      // Track processed Set numbers for this ExerciseLog
      const processedSetNumbers = new Set<number>();

      for (const [set_number, set] of sets.entries()) {
        processedSetNumbers.add(set_number);

        const existingSet = await tx.set.findUnique({
          where: {
            exercise_log_id_set_number: {
              exercise_log_id: exerciseLogId,
              set_number,
            },
          },
        });

        if (existingSet) {
          // Update existing set
          await tx.set.update({
            where: {
              exercise_log_id_set_number: {
                exercise_log_id: exerciseLogId,
                set_number,
              },
            },
            data: {
              reps: set.reps,
              weight: set.weight,
              type: set.type,
              updated_at: new Date(),
            },
          });
        } else {
          // Create new set
          await tx.set.create({
            data: {
              userId,
              exercise_log_id: exerciseLogId,
              exerciseId: exercise.id,
              set_number,
              reps: set.reps,
              weight: set.weight,
              type: set.type,
              created_at: new Date(),
              updated_at: new Date(),
            },
          });
        }
      }

      // Delete extra sets (not in input)
      await tx.set.deleteMany({
        where: {
          exercise_log_id: exerciseLogId,
          set_number: {
            notIn: Array.from(processedSetNumbers),
          },
        },
      });
    }

    // 3. Delete extra ExerciseLogs and their Sets
    const existingLogsToDelete = await tx.exerciseLog.findMany({
      where: {
        workoutLogId: workout.id,
        order: {
          gte: workout.exerciseslog.length,
        },
      },
      select: { id: true },
    });

    const idsToDelete = existingLogsToDelete.map((log) => log.id);

    if (idsToDelete.length > 0) {
      // Delete associated Sets first
      await tx.set.deleteMany({
        where: {
          exercise_log_id: {
            in: idsToDelete,
          },
        },
      });

      // Then delete the ExerciseLogs
      await tx.exerciseLog.deleteMany({
        where: {
          id: {
            in: idsToDelete,
          },
        },
      });
    }
  });
};

export const deleteUserWorkoutinDB = async (userId: number, workoutId: number) => {
  await prisma.$transaction(async (tx) => {
    // Get all ExerciseLogs first
    const oldExerciseLogs = await tx.exerciseLog.findMany({
      where: {
        workoutLogId: workoutId,
      },
      select: { id: true },
    });

    const oldExerciseLogIds = oldExerciseLogs.map((log) => log.id);

    // Delete all Sets linked to those ExerciseLogs
    if (oldExerciseLogIds.length > 0) {
      await tx.set.deleteMany({
        where: {
          exercise_log_id: { in: oldExerciseLogIds },
        },
      });

      // Delete ExerciseLogs
      await tx.exerciseLog.deleteMany({
        where: {
          workoutLogId: workoutId,
        },
      });
    }

    // Now delete the WorkoutLog safely
    await tx.workoutLog.delete({
      where: {
        id: workoutId,
        userId: userId,
      },
    });
  });
};
