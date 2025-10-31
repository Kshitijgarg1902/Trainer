import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { WorkoutLog } from '../../../types/Workouttypes';
import { typeColorMap } from '../../../types/Settypes';
import ExercisePicker from '../../../Components/ExercisPicker';
import { ExerciseData } from '../../../types/Exercisetypes';
import ModalPopup from '../../../Components/ModalPopUp';
import CustomDropdown from '../../../Components/CustomSelect';

interface EditWorkoutModalProps {
  workout: WorkoutLog;
  onClose: () => void;
  onSave: (updatedWorkout: WorkoutLog) => void;
}

const setTypeOptions: Array<'N' | 'W' | 'F'> = ['N', 'W', 'F'];

const EditWorkoutModal: React.FC<EditWorkoutModalProps> = ({
  workout,
  onClose,
  onSave,
}) => {
  const [editWorkout, setEditWorkout] = useState<WorkoutLog>(
    JSON.parse(JSON.stringify(workout)),
  );
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedExercises, setExpandedExercises] = useState<{
    [index: number]: boolean;
  }>({});

  useEffect(() => {
    const isEqual = JSON.stringify(editWorkout) === JSON.stringify(workout);
    setHasChanges(!isEqual);
  }, [editWorkout, workout]);

  const handleSetChange = (
    exerciseIndex: number,
    setIndex: number,
    key: 'weight' | 'reps' | 'type',
    value: number | 'N' | 'W' | 'F',
  ) => {
    const updated = { ...editWorkout };
    const set = updated.exerciseslog[exerciseIndex].sets[setIndex];

    if (key === 'type') {
      set.type = value as 'N' | 'W' | 'F';
    } else {
      set[key] = value as number;
    }

    setEditWorkout(updated);
  };

  const addSet = (exerciseIndex: number) => {
    const updated = { ...editWorkout };
    updated.exerciseslog[exerciseIndex].sets.push({
      type: 'N',
      weight: 0,
      reps: 0,
    });
    setEditWorkout(updated);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updated = { ...editWorkout };
    updated.exerciseslog[exerciseIndex].sets.splice(setIndex, 1);
    setEditWorkout(updated);
  };

  const removeExercise = (exerciseIndex: number) => {
    const updated = { ...editWorkout };
    updated.exerciseslog.splice(exerciseIndex, 1);
    setEditWorkout(updated);
  };

  const addExercise = (exercise: ExerciseData) => {
    if (editWorkout.exerciseslog.length >= 20) return;
    const updated = { ...editWorkout };
    updated.exerciseslog.push({
      exercise: {
        id: exercise.id,
        name: exercise.name,
        category: exercise.category,
        equipment: exercise.equipment,
      },
      sets: [{ type: 'N', weight: 0, reps: 0 }],
      notes: null,
    });
    setEditWorkout(updated);
    setShowExercisePicker(false);
  };

  const toggleExpand = (index: number) => {
    setExpandedExercises((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSave = () => {
    onSave(editWorkout);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-2xl h-[90vh] bg-white rounded-2xl shadow-xl pt-12 pb-20 px-6 flex flex-col"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-black transition-colors"
          >
            <X size={22} strokeWidth={2.2} />
          </button>
          <div className="overflow-y-auto no-scrollbar flex-1 pr-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Duration:
                </label>
                <input
                  type="number"
                  value={editWorkout.duration_minutes}
                  onChange={(e) =>
                    setEditWorkout({
                      ...editWorkout,
                      duration_minutes: Number(e.target.value),
                    })
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
                <span className="text-sm text-gray-600">minutes</span>
              </div>

              <div className="text-sm font-medium text-gray-700">
                Volume:{' '}
                <span className="font-bold text-blue-700">
                  {editWorkout.exerciseslog.reduce(
                    (total, log) =>
                      total +
                      log.sets.reduce(
                        (sum, set) => sum + (set.reps ?? 0) * (set.weight ?? 0),
                        0,
                      ),
                    0,
                  )}{' '}
                  kg
                </span>
              </div>
            </div>

            <div className="space-y-0 divide-y divide-gray-300">
              {editWorkout.exerciseslog.map((log, index) => {
                const expanded = expandedExercises[index];
                return (
                  <div key={index} className="py-4">
                    <div className="flex justify-between items-center mb-2">
                      <button
                        onClick={() => toggleExpand(index)}
                        className="flex items-center gap-2 text-left text-lg font-semibold text-gray-800"
                      >
                        {expanded ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                        {log.exercise.name}
                      </button>
                      <button
                        onClick={() => removeExercise(index)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-3 overflow-hidden"
                        >
                          {log.sets.map((set, setIndex) => (
                            <div
                              key={setIndex}
                              className="flex flex-wrap md:flex-nowrap items-center gap-3"
                            >
                              <CustomDropdown
                                value={set.type}
                                onChange={(e) =>
                                  handleSetChange(
                                    index,
                                    setIndex,
                                    'type',
                                    e as 'N' | 'W' | 'F',
                                  )
                                }
                                className={`px-3 py-1 text-sm w-16 text-center bg-white`}
                              />
                              <input
                                type="number"
                                value={set.weight}
                                onChange={(e) =>
                                  handleSetChange(
                                    index,
                                    setIndex,
                                    'weight',
                                    Number(e.target.value),
                                  )
                                }
                                className="w-20 px-3 py-2 border rounded-md text-sm"
                              />
                              <span className="text-sm text-gray-600">kg</span>

                              <input
                                type="number"
                                value={set.reps}
                                onChange={(e) =>
                                  handleSetChange(
                                    index,
                                    setIndex,
                                    'reps',
                                    Number(e.target.value),
                                  )
                                }
                                className="w-20 px-3 py-2 border rounded-md text-sm"
                              />
                              <span className="text-sm text-gray-600">
                                reps
                              </span>

                              {log.sets.length > 1 && (
                                <button
                                  onClick={() => removeSet(index, setIndex)}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          ))}

                          <button
                            onClick={() => addSet(index)}
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Plus size={14} /> Add Set
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full bg-white px-6 py-4 border-t flex gap-4">
            <button
              onClick={() => setShowExercisePicker(true)}
              disabled={editWorkout.exerciseslog.length >= 20}
              className="flex-1 py-2 border border-blue-600 text-blue-700 font-medium rounded-md hover:bg-blue-50 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add Exercise
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || editWorkout.exerciseslog.length === 0}
              className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
            >
              Save Changes
            </button>
          </div>
          {showExercisePicker && (
            <ExercisePicker
              onClose={() => setShowExercisePicker(false)}
              onSelect={addExercise}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditWorkoutModal;
