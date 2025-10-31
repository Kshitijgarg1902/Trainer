import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Plus, Trash2, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { ExerciseData } from '../../../types/Exercisetypes';
import { WorkoutTemplate } from '../../../types/Templatetypes';
import LoadingOverlay from '../../../Components/LoadingOverlay';
import ExercisePicker from '../../../Components/ExercisPicker';
import CustomDropdown from '../../../Components/CustomSelect';

type SetType = 'W' | 'N' | 'F';

interface SetInput {
  type: SetType;
}

interface ExerciseInput {
  exericseId: number;
  exerciseName: string;
  sets: SetInput[];
}

interface EditTemplateModalProps {
  template: WorkoutTemplate;
  onClose: () => void;
  onSave: (updatedData: WorkoutTemplate) => void;
}
const typeColorMap: Record<SetType, string> = {
  F: 'text-red-500 border-red-400',
  W: 'text-yellow-500 border-yellow-400',
  N: 'text-blue-500 border-blue-400',
};

const EditTemplateModal: React.FC<EditTemplateModalProps> = ({
  template,
  onClose,
  onSave,
}) => {
  const isLoading = useSelector((state: RootState) => state.exercise.isLoading);

  const [templateName, setTemplateName] = useState(template.templateData.name);
  const [exercises, setExercises] = useState<ExerciseInput[]>(
    template.templateData.exercises.map((ex) => ({
      exericseId: ex.exerciseId,
      exerciseName: ex.exerciseName,
      sets: ex.sets.map((set) => ({ type: set.type })),
    })),
  );
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<
    number | null
  >(null);

  const toggleExpand = (index: number) => {
    setExpandedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const addExercise = () => {
    setSelectedExerciseIndex(exercises.length);
    setShowExercisePicker(true);
  };

  const handleExerciseSelect = (ex: ExerciseData) => {
    if (selectedExerciseIndex === null) return;
    const updated = [...exercises];
    updated.splice(selectedExerciseIndex, 0, {
      exericseId: ex.id,
      exerciseName: ex.name,
      sets: [{ type: 'W' }],
    });
    setExercises(updated);
    setExpandedIndexes((prev) => [...prev, selectedExerciseIndex]);
    setShowExercisePicker(false);
    setSelectedExerciseIndex(null);
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
    setExpandedIndexes(expandedIndexes.filter((i) => i !== index));
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
      alert('Template name is required!');
      return;
    }

    const updatedTemplate: WorkoutTemplate = {
      id: template.id,
      templateData: {
        name: templateName.trim(),
        exercises: exercises.map((ex) => ({
          exerciseId: ex.exericseId,
          exerciseName: ex.exerciseName,
          sets: ex.sets.map((set) => ({ type: set.type })),
        })),
      },
    };

    onSave(updatedTemplate);
    onClose();
  };

  const disableActions = showExercisePicker || template.id <= 8;
  const disableSave = !templateName.trim() || exercises.length === 0;

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
            <h2 className="text-xl font-bold text-blue-700">Edit Template</h2>
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
            disabled={disableActions}
          />

          {exercises.map((exercise, exerciseIndex) => {
            const isExpanded = expandedIndexes.includes(exerciseIndex);
            return (
              <div key={exerciseIndex} className="border-t border-b py-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">
                    {exercise.exerciseName}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleExpand(exerciseIndex)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {isExpanded ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                    <button
                      onClick={() => removeExercise(exerciseIndex)}
                      className="text-gray-400 hover:text-gray-600"
                      disabled={disableActions}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden space-y-3"
                    >
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="flex items-center gap-3">
                          <span className="text-sm">Set {setIndex + 1}</span>
                          <CustomDropdown
                            value={set.type}
                            onChange={(e) =>
                              updateSetType(
                                exerciseIndex,
                                setIndex,
                                e as SetType,
                              )
                            }
                            className={`px-2 py-1 text-sm w-16 text-center bg-white`}
                          />
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

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
              className={`px-5 py-2 rounded-md text-white ${
                disableSave || disableActions
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={disableSave || disableActions}
            >
              Save Changes
            </button>
          </div>
        </motion.div>

        {/* Exercise Picker Modal */}
        {showExercisePicker && (
          <ExercisePicker
            onClose={() => setShowExercisePicker(false)}
            onSelect={handleExerciseSelect}
          />
        )}

        {isLoading && <LoadingOverlay />}
      </motion.div>
    </AnimatePresence>
  );
};

export default EditTemplateModal;
