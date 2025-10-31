import React from 'react';
import {
  Template,
  SetType,
  WorkoutTemplate,
} from '../../../types/Templatetypes';
import { motion, AnimatePresence } from 'framer-motion';

const typeColorMap: Record<SetType, string> = {
  F: 'text-red-500 border-red-400',
  W: 'text-yellow-500 border-yellow-400',
  N: 'text-blue-500 border-blue-400',
};

interface TemplateModalProps {
  selectedTemplate: Template;
  setSelectedTemplate: React.Dispatch<WorkoutTemplate | null>;
}

const TemplateModal = ({
  selectedTemplate,
  setSelectedTemplate,
}: TemplateModalProps) => {
  const [expandedExercises, setExpandedExercises] = React.useState<Set<number>>(
    new Set(),
  );

  const toggleExpand = (idx: number) => {
    setExpandedExercises((prev) => {
      const newSet = new Set(prev);
      newSet.has(idx) ? newSet.delete(idx) : newSet.add(idx);
      return newSet;
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[50%] xl:w-[40%] max-h-[90vh] rounded-xl bg-white p-6 shadow-xl flex flex-col"
        >
          {/* Header */}
          <div className="mb-4 flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold text-blue-700">
              {selectedTemplate.name}
            </h2>
            <button
              onClick={() => setSelectedTemplate(null)}
              className="text-2xl text-gray-400 transition hover:text-gray-600"
              aria-label="Close Modal"
            >
              &times;
            </button>
          </div>
          <div
            className="flex-1 pr-1 space-y-6 overflow-y-auto no-scrollbar"
            style={{ minHeight: '50vh', maxHeight: '50vh' }}
          >
            {selectedTemplate.exercises.map((exercise, idx) => {
              const isExpanded = expandedExercises.has(idx);
              const setCount = exercise.sets.length;

              return (
                <div key={idx} className="border-b pb-4">
                  <div
                    className="cursor-pointer flex justify-between items-center"
                    onClick={() => toggleExpand(idx)}
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {exercise.exerciseName}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {setCount} {setCount === 1 ? 'Set' : 'Sets'}
                    </span>
                  </div>

                  <div
                    className={`transition-all overflow-hidden duration-300 ease-in-out`}
                    style={{
                      maxHeight: isExpanded ? `${setCount * 48 + 24}px` : '0px',
                    }}
                  >
                    <div className="mt-4 space-y-3">
                      {exercise.sets.map((set, setIndex) => (
                        <div
                          key={setIndex}
                          className="flex items-center gap-4 text-sm"
                        >
                          <span
                            className={`font-medium ${typeColorMap[set.type]}`}
                          >
                            {set.type}
                          </span>
                          <input
                            type="text"
                            disabled
                            readOnly
                            value={`Set ${setIndex + 1}`}
                            className="w-40 rounded-md border border-gray-300 bg-gray-100 px-3 py-1 text-gray-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TemplateModal;
