import { motion } from 'framer-motion';
import { WorkoutLog } from '../../../types/Workouttypes';
import { format } from 'date-fns';
import { typeColorMap } from '../../../types/Settypes';

interface WorkoutModalProps {
  selectedWorkout: WorkoutLog;
  setSelectedWorkout: (workout: WorkoutLog | null) => void;
}

const WorkoutModal: React.FC<WorkoutModalProps> = ({
  selectedWorkout,
  setSelectedWorkout,
}: WorkoutModalProps) => {
  const totalVolume = selectedWorkout.exerciseslog.reduce((volume, log) => {
    return (
      volume +
      log.sets.reduce((sum, set) => {
        return sum + set.reps * (set.weight ?? 0);
      }, 0)
    );
  }, 0);

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto no-scrollbar p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-700">
            Workout on{' '}
            {format(new Date(selectedWorkout.created_at), 'dd-MM-yyyy')}
          </h2>
          <button
            onClick={() => setSelectedWorkout(null)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            &times;
          </button>
        </div>

        {/* Summary section */}
        <div className="flex flex-wrap justify-between gap-4 mb-6 bg-gray-100 p-4 rounded-xl">
          <div>
            <p className="text-gray-500 text-sm">Duration</p>
            <p className="text-lg font-semibold text-gray-800">
              {selectedWorkout.duration_minutes} min
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Volume</p>
            <p className="text-lg font-semibold text-gray-800">
              {totalVolume} kg
            </p>
          </div>
        </div>

        {/* Exercise logs */}
        <div className="space-y-6">
          {selectedWorkout.exerciseslog.map((exerciselog, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {exerciselog.exercise.name}
              </h3>
              <div className="flex flex-col space-y-3">
                {exerciselog.sets.map((set, setIndex) => (
                  <motion.div
                    key={setIndex}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 md:gap-x-6"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: setIndex * 0.05 }}
                  >
                    <span
                      className={`font-bold border px-3 py-1 rounded-full text-sm ${typeColorMap[set.type]}`}
                    >
                      {set.type}
                    </span>

                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={set.weight ?? 0}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md bg-neutral-50 text-sm text-gray-800"
                        readOnly
                      />
                      <span className="text-gray-600 text-sm">kg</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={set.reps}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md bg-neutral-50 text-sm text-gray-800"
                        readOnly
                      />
                      <span className="text-gray-600 text-sm">reps</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WorkoutModal;
