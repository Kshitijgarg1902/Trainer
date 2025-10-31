import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { ExerciseData } from '../../../types/Exercisetypes';
import { newWorkoutTemplate, SetType } from '../../../types/Templatetypes';
import LoadingOverlay from '../../../Components/LoadingOverlay';
import CustomDropdown from '../../../Components/CustomSelect';

interface SetInput {
  type: SetType;
}

interface ExerciseInput {
  exerciseId: number;
  exerciseName: string;
  sets: SetInput[];
}

interface CreateTemplateModalProps {
  onClose: () => void;
  onSave: (templateData: newWorkoutTemplate) => void;
}

const setTypeOptions: SetType[] = ['W', 'N', 'F'];

const typeColorMap: Record<SetType, string> = {
  F: 'text-red-500 border-red-400',
  W: 'text-yellow-500 border-yellow-400',
  N: 'text-blue-500 border-blue-400',
};

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  onClose,
  onSave,
}) => {
  const exerciseData = useSelector(
    (state: RootState) => state.exercise.exercises,
  );
  const isLoading = useSelector((state: RootState) => state.exercise.isLoading);

  const [templateName, setTemplateName] = useState('');
  const [exercises, setExercises] = useState<ExerciseInput[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<
    number | null
  >(null);
  const [exerciseSearch, setExerciseSearch] = useState('');

  const addExercise = () => {
    setSelectedExerciseIndex(exercises.length);
    setShowExercisePicker(true);
  };

  const handleExerciseSelect = (ex: ExerciseData) => {
    if (selectedExerciseIndex === null) return;
    const updated = [...exercises];
    updated.splice(selectedExerciseIndex, 0, {
      exerciseId: ex.id,
      exerciseName: ex.name,
      sets: [{ type: 'W' }],
    });
    setExercises(updated);
    setShowExercisePicker(false);
    setSelectedExerciseIndex(null);
    setExerciseSearch('');
  };

  const addSet = (exerciseIndex: number) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets.push({ type: 'N' });
    setExercises(updated);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets.splice(setIndex, 1);
    setExercises(updated);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateSetType = (
    exerciseIndex: number,
    setIndex: number,
    type: SetType,
  ) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets[setIndex].type = type;
    setExercises(updated);
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      return alert('Template name is required!');
    }

    const templateData: newWorkoutTemplate = {
      templateData: {
        name: templateName.trim(),
        exercises: exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          sets: ex.sets.map((set) => ({ type: set.type })),
        })),
      },
    };

    onSave(templateData);
    onClose();
  };

  const disableActions = showExercisePicker;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl h-[60vh] overflow-y-auto bg-white rounded-lg p-6 shadow-xl no-scrollbar relative z-10"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-700">Create Template</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              <X />
            </button>
          </div>

          <input
            type="text"
            placeholder="Template Name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-6"
          />

          {exercises.map((exercise, exerciseIndex) => (
            <div
              key={exerciseIndex}
              className="border-t border-b py-4 space-y-3 mb-4"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">
                  {exercise.exerciseName}
                </span>
                <button
                  onClick={() => removeExercise(exerciseIndex)}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={disableActions}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="flex items-center gap-3">
                  <span className="text-sm">Set {setIndex + 1}</span>
                  <CustomDropdown
                    value={set.type}
                    onChange={(e) =>
                      updateSetType(exerciseIndex, setIndex, e as SetType)
                    }
                    className={`px-2 py-1 text-sm w-16 text-center bg-white`}
                  />
                  {/* <select
                    value={set.type}
                    onChange={(e) =>
                      updateSetType(
                        exerciseIndex,
                        setIndex,
                        e.target.value as SetType,
                      )
                    }
                    className={`px-2 py-1 border rounded-md text-sm w-16 text-center bg-white ${typeColorMap[set.type]}`}
                    disabled={disableActions}
                  >
                    {setTypeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select> */}
                  {exercise.sets.length > 1 && (
                    <button
                      onClick={() => removeSet(exerciseIndex, setIndex)}
                      className="text-gray-400 hover:text-gray-600"
                      disabled={disableActions}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={() => addSet(exerciseIndex)}
                className="text-sm text-blue-600 hover:underline"
                disabled={disableActions}
              >
                + Add Set
              </button>
            </div>
          ))}

          <button
            onClick={addExercise}
            className="w-full py-2 text-blue-700 font-medium border border-blue-600 rounded-md hover:bg-blue-50 flex items-center justify-center gap-2"
            disabled={disableActions}
          >
            <Plus size={18} /> Add Exercise
          </button>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={
                disableActions || !templateName.trim() || exercises.length === 0
              }
            >
              Save Template
            </button>
          </div>
        </motion.div>

        {/* Exercise Picker Modal */}
        {showExercisePicker && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md relative">
              <button
                onClick={() => {
                  setShowExercisePicker(false);
                  setSelectedExerciseIndex(null);
                }}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X />
              </button>
              <h3 className="text-lg font-semibold mb-3">Select Exercise</h3>
              <input
                type="text"
                placeholder="Search exercises..."
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
              />
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {exerciseData
                  .filter(
                    (ex) =>
                      !exercises.some((e) => e.exerciseName === ex.name) &&
                      ex.name
                        .toLowerCase()
                        .includes(exerciseSearch.toLowerCase()),
                  )
                  .map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => handleExerciseSelect(ex)}
                      className="block w-full text-left px-4 py-2 rounded hover:bg-blue-100 text-gray-700"
                    >
                      {ex.name}
                    </button>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
        {isLoading && <LoadingOverlay />}
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateTemplateModal;
