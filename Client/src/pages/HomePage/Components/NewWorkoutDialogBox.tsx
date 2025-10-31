import React from 'react';
import { NavLink } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { WorkoutTemplate } from '../../../types/Templatetypes';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  templates: WorkoutTemplate[];
};

const NewWorkoutDialogBox: React.FC<Props> = ({
  isOpen,
  onClose,
  templates,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-11/12 sm:w-full max-w-sm sm:max-w-lg rounded-xl shadow-lg p-6 relative"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>

            {/* Scrollable List */}
            <div className="flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-1">
              <NavLink
                to="/newWorkout"
                className="p-4 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm transition border border-dashed border-gray-400 text-center font-medium text-gray-700"
                onClick={onClose}
              >
                Start an Empty Workout
              </NavLink>
              {templates.map((template) => (
                <NavLink
                  key={template.id}
                  to="/newWorkout"
                  state={{ template }}
                  className="p-4 bg-blue-100 hover:bg-blue-200 rounded-md shadow-sm transition"
                  onClick={() =>
                    localStorage.setItem(
                      'newWorkoutTemplate',
                      JSON.stringify(template.templateData),
                    )
                  }
                >
                  <h3 className="text-lg font-bold text-blue-800">
                    {template.templateData.name}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {template.templateData.exercises.length} exercises
                  </p>
                </NavLink>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewWorkoutDialogBox;
