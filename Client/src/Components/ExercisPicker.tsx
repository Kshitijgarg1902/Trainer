import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import LoadingOverlay from './LoadingOverlay';
import { fetchExerciseData } from '../store/Exercise/ExerciseSlice';
import { ExerciseData } from '../types/Exercisetypes';

interface ExercisePickerProps {
  onClose: () => void;
  onSelect: (exercise: ExerciseData) => void;
}
const ExercisePicker: React.FC<ExercisePickerProps> = ({
  onClose,
  onSelect,
}: ExercisePickerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { exercises, isLoading } = useSelector(
    (state: RootState) => state.exercise,
  );

  useEffect(() => {
    if (exercises.length === 0) {
      dispatch(fetchExerciseData());
    }
  }, []);
  const [searchExercise, setSearchExercise] = useState<string>('');

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
      >
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <X />
          </button>
          <h3 className="text-lg font-semibold mb-3">Select Exercise</h3>
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchExercise}
            onChange={(e) => setSearchExercise(e.target.value)}
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
          />
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {exercises
              .filter((exercise) =>
                exercise.name
                  .toLowerCase()
                  .includes(searchExercise.toLowerCase()),
              )
              .map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => onSelect(exercise)}
                  className="block w-full text-left px-4 py-2 rounded hover:bg-blue-100 text-gray-700"
                >
                  {exercise.name}
                </button>
              ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ExercisePicker;
