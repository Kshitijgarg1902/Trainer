export type SetType = 'F' | 'W' | 'N';

export type TemplateSet = {
  type: SetType;
};

export type TemplateExercise = {
  exerciseId: number;
  exerciseName: string;
  sets: TemplateSet[];
};

export type Template = {
  name: string;
  exercises: TemplateExercise[];
};

export type WorkoutTemplate = {
  id: number;
  templateData: Template;
};

export type newWorkoutTemplate = {
  templateData: Template;
};
