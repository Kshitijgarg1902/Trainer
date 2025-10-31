import { PrismaClient, SetType } from '@prisma/client';

const prisma = new PrismaClient();

function getRandomDateOnly(start: Date, end: Date): Date {
  const timestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  const date = new Date(timestamp);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

async function main() {
  const userId = 0;

  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      username: 'Admin',
      mobileNumber: '9999999999',
      countryCode: '+91',
      height: 180,
      weight: 80,
      age: 20,
      gender: 'M',
    },
  });

  await prisma.exercise.createMany({
    data: [
      // Chest
      {
        userId: userId,
        name: 'Barbell Bench Press',
        category: 'Chest',
        equipment: 'Barbell',
      },
      {
        userId: userId,
        name: 'Incline Dumbbell Press',
        category: 'Chest',
        equipment: 'Dumbbell',
      },
      { userId: userId, name: 'Push-Up', category: 'Chest', equipment: null },
      {
        userId: userId,
        name: 'Chest Fly Machine',
        category: 'Chest',
        equipment: 'Machine',
      },
      {
        userId: userId,
        name: 'Dips (Chest Lean)',
        category: 'Chest',
        equipment: 'Dip Bars',
      },
      {
        userId: userId,
        name: 'Incline Barbell Press',
        category: 'Chest',
        equipment: 'Barbell',
      },
      {
        userId: userId,
        name: 'Cable Crossover',
        category: 'Chest',
        equipment: 'Cable',
      },

      // Back
      {
        userId: userId,
        name: 'Deadlift',
        category: 'Back',
        equipment: 'Barbell',
      },
      { userId: userId, name: 'Pull-Up', category: 'Back', equipment: null },
      { userId: userId, name: 'Chin-Up', category: 'Back', equipment: null },
      {
        userId: userId,
        name: 'Lat Pulldown',
        category: 'Back',
        equipment: 'Machine',
      },
      {
        userId: userId,
        name: 'Barbell Row',
        category: 'Back',
        equipment: 'Barbell',
      },
      {
        userId: userId,
        name: 'Seated Cable Row',
        category: 'Back',
        equipment: 'Cable',
      },
      {
        userId: userId,
        name: 'T-Bar Row',
        category: 'Back',
        equipment: 'Barbell',
      },
      {
        userId: userId,
        name: 'Face Pull',
        category: 'Back',
        equipment: 'Cable',
      },

      // Legs
      {
        userId: userId,
        name: 'Barbell Back Squat',
        category: 'Legs',
        equipment: 'Barbell',
      },
      {
        userId: userId,
        name: 'Leg Press',
        category: 'Legs',
        equipment: 'Machine',
      },
      {
        userId: userId,
        name: 'Walking Lunge',
        category: 'Legs',
        equipment: 'Dumbbell',
      },
      {
        userId: userId,
        name: 'Bodyweight Lunge',
        category: 'Legs',
        equipment: null,
      },
      {
        userId: userId,
        name: 'Bulgarian Split Squat',
        category: 'Legs',
        equipment: 'Dumbbell',
      },
      {
        userId: userId,
        name: 'Romanian Deadlift',
        category: 'Legs',
        equipment: 'Barbell',
      },
      {
        userId: userId,
        name: 'Leg Curl Machine',
        category: 'Legs',
        equipment: 'Machine',
      },
      {
        userId: userId,
        name: 'Leg Extension',
        category: 'Legs',
        equipment: 'Machine',
      },
      {
        userId: userId,
        name: 'Calf Raise (Standing)',
        category: 'Legs',
        equipment: 'Machine',
      },
      {
        userId: userId,
        name: 'Calf Raise (Seated)',
        category: 'Legs',
        equipment: 'Machine',
      },

      // Shoulders
      {
        userId: userId,
        name: 'Overhead Press',
        category: 'Shoulders',
        equipment: 'Barbell',
      },
      {
        userId: userId,
        name: 'Dumbbell Shoulder Press',
        category: 'Shoulders',
        equipment: 'Dumbbell',
      },
      {
        userId: userId,
        name: 'Lateral Raise',
        category: 'Shoulders',
        equipment: 'Dumbbell',
      },
      {
        userId: userId,
        name: 'Front Raise',
        category: 'Shoulders',
        equipment: 'Dumbbell',
      },
      {
        userId: userId,
        name: 'Rear Delt Fly',
        category: 'Shoulders',
        equipment: 'Dumbbell',
      },
      {
        userId: userId,
        name: 'Arnold Press',
        category: 'Shoulders',
        equipment: 'Dumbbell',
      },
      {
        userId: userId,
        name: 'Shrugs',
        category: 'Shoulders',
        equipment: 'Dumbbell',
      },

      // Biceps
      {
        userId: userId,
        name: 'Barbell Curl',
        category: 'Biceps',
        equipment: 'Barbell',
      },
      {
        userId: userId,
        name: 'Dumbbell Curl',
        category: 'Biceps',
        equipment: 'Dumbbell',
      },
      {
        userId: userId,
        name: 'Hammer Curl',
        category: 'Biceps',
        equipment: 'Dumbbell',
      },
      {
        userId: userId,
        name: 'Preacher Curl',
        category: 'Biceps',
        equipment: 'Machine',
      },
      {
        userId: userId,
        name: 'Cable Curl',
        category: 'Biceps',
        equipment: 'Cable',
      },
      {
        userId: userId,
        name: 'Concentration Curl',
        category: 'Biceps',
        equipment: 'Dumbbell',
      },

      // Triceps
      {
        userId: userId,
        name: 'Tricep Pushdown',
        category: 'Triceps',
        equipment: 'Cable',
      },
      {
        userId: userId,
        name: 'Overhead Tricep Extension',
        category: 'Triceps',
        equipment: 'Dumbbell',
      },
      {
        userId: userId,
        name: 'Skull Crushers',
        category: 'Triceps',
        equipment: 'EZ Bar',
      },
      {
        userId: userId,
        name: 'Close-Grip Bench Press',
        category: 'Triceps',
        equipment: 'Barbell',
      },
      {
        userId: userId,
        name: 'Bench Dips',
        category: 'Triceps',
        equipment: 'Bench',
      },

      // Core
      { userId: userId, name: 'Plank', category: 'Core', equipment: null },
      {
        userId: userId,
        name: 'Hanging Leg Raise',
        category: 'Core',
        equipment: 'Pull-up Bar',
      },
      {
        userId: userId,
        name: 'Russian Twist',
        category: 'Core',
        equipment: 'Plate',
      },
      {
        userId: userId,
        name: 'Cable Crunch',
        category: 'Core',
        equipment: 'Cable',
      },
      {
        userId: userId,
        name: 'Bicycle Crunch',
        category: 'Core',
        equipment: null,
      },
      {
        userId: userId,
        name: 'Ab Wheel Rollout',
        category: 'Core',
        equipment: 'Ab Wheel',
      },
      { userId: userId, name: 'Sit-Up', category: 'Core', equipment: null },
      {
        userId: userId,
        name: 'Mountain Climber',
        category: 'Core',
        equipment: null,
      },
    ],
    skipDuplicates: true, // Avoids errors if you re-run the script
  });

  // Get all exercises
  const exercises = await prisma.exercise.findMany({ where: { userId } });
  const exerciseMap = new Map(exercises.map((e) => [e.name, e.id]));

  // Template data (with exerciseIds)
  const templates = [
    {
      name: 'Push',
      exercises: [
        'Barbell Bench Press',
        'Incline Dumbbell Press',
        'Push-Up',
        'Chest Fly Machine',
        'Dips (Chest Lean)',
        'Incline Barbell Press',
      ],
    },
    {
      name: 'Pull',
      exercises: [
        'Deadlift',
        'Pull-Up',
        'Chin-Up',
        'Lat Pulldown',
        'Barbell Row',
        'Seated Cable Row',
      ],
    },
    {
      name: 'Legs',
      exercises: [
        'Barbell Back Squat',
        'Leg Press',
        'Walking Lunge',
        'Bodyweight Lunge',
        'Bulgarian Split Squat',
      ],
    },
    {
      name: 'Chest',
      exercises: [
        'Barbell Bench Press',
        'Incline Dumbbell Press',
        'Push-Up',
        'Chest Fly Machine',
        'Dips (Chest Lean)',
      ],
    },
    {
      name: 'Shoulders',
      exercises: [
        'Overhead Press',
        'Dumbbell Shoulder Press',
        'Lateral Raise',
        'Front Raise',
        'Rear Delt Fly',
      ],
    },
    {
      name: 'Arms',
      exercises: ['Barbell Curl', 'Dumbbell Curl', 'Hammer Curl', 'Preacher Curl', 'Cable Curl'],
    },
    {
      name: 'Back',
      exercises: ['Deadlift', 'Pull-Up', 'Chin-Up', 'Lat Pulldown', 'Barbell Row'],
    },
    {
      name: 'Core',
      exercises: ['Plank', 'Hanging Leg Raise', 'Russian Twist', 'Cable Crunch', 'Bicycle Crunch'],
    },
  ];

  for (const template of templates) {
    await prisma.template.create({
      data: {
        userId,
        template: {
          name: template.name,
          exercises: template.exercises.map((exerciseName) => ({
            exerciseName,
            exerciseId: exerciseMap.get(exerciseName) ?? undefined,
            sets: [{ type: 'N' }, { type: 'N' }, { type: 'N' }],
          })),
        },
      },
    });
  }

  // Create workout logs
  const workouts = Array.from({ length: 10 }, (_, i) => i + 1);

  for (const i of workouts) {
    const workout = await prisma.workoutLog.create({
      data: {
        userId,
        created_at: getRandomDateOnly(new Date('2024-01-01'), new Date('2025-01-01')),
        duration_minutes: 30 + (i % 3) * 10,
        notes: `Workout session #${i}`,
      },
    });

    const selectedExercises = exercises.slice(
      (i * 5) % exercises.length,
      ((i * 5) % exercises.length) + 5
    );

    for (let j = 0; j < selectedExercises.length; j++) {
      const exercise = selectedExercises[j];

      const exerciseLog = await prisma.exerciseLog.create({
        data: {
          workoutLogId: workout.id,
          exerciseId: exercise.id,
          order: j + 1,
          notes: `Exercise #${j + 1} in workout #${i}`,
        },
      });

      for (let s = 1; s <= 3; s++) {
        const weight: number = await prisma
          .$queryRawUnsafe<
            { round: number }[]
          >('SELECT ROUND(RANDOM() * 40 + 20)::DECIMAL as round')
          .then((res) => res[0].round);

        await prisma.set.create({
          data: {
            userId,
            exercise_log_id: exerciseLog.id,
            exerciseId: exercise.id,
            set_number: s,
            reps: 10,
            weight: weight,
            type: s === 1 ? SetType.W : SetType.N,
          },
        });
      }
    }
  }

  console.log('✅ Seed complete!');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
