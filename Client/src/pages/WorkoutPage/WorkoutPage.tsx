import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkoutLog } from '../../types/Workouttypes';
import { useDispatch, useSelector } from 'react-redux';
import { getUserWorkouts } from '../../store/Workout/WorkoutSlice';
import { AppDispatch, RootState } from '../../store/store';
import { format } from 'date-fns';
import WorkoutModal from './Components/WorkoutModal';
import LoadingOverlay from '../../Components/LoadingOverlay';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import EditWorkoutModal from './Components/EditWorkoutModal';
import {
  removeWorkout,
  updateWorkout,
} from '../../services/workoutPageService';
import ModalPopupSubmit from '../../Components/ModalPopUpSubmit';
import ModalPopup from '../../Components/ModalPopUp';

const WorkoutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { workouts, isLoading } = useSelector(
    (state: RootState) => state.workout,
  );

  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutLog | null>(
    null,
  );

  const [editWorkout, setEditWorkout] = useState<WorkoutLog | null>(null);
  const [deleteWorkout, setDeleteWorkout] = useState<WorkoutLog | null>(null);
  const [errorPopup, setErrorPopup] = useState<boolean>(false);
  const [isBusy, setisBusy] = useState<boolean>(false);

  useEffect(() => {
    workouts.length < 1 && dispatch(getUserWorkouts());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white py-10 px-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-700">Workout History</h1>
        </div>

        {/* Workout Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 mt-10">
              No workouts yet. Start logging your workouts!
            </div>
          ) : (
            workouts.length > 0 &&
            workouts.map((workout, index) => (
              <motion.div
                key={workout.id}
                onClick={() => setSelectedWorkout(workout)}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 cursor-pointer hover:shadow-xl transition relative group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Workout {workouts.length - index}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {format(new Date(workout.created_at), 'dd MMM yyyy')}
                  </span>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-blue-600">
                    <span className="font-medium text-blue-600">
                      {workout.exerciseslog.length}
                    </span>{' '}
                    exercises •{' '}
                    <span className="font-medium text-blue-600">
                      {workout.exerciseslog.reduce(
                        (acc, ex) => acc + ex.sets.length,
                        0,
                      )}
                    </span>{' '}
                    sets
                  </p>
                </div>

                {/* Edit & Delete buttons */}
                <div className="absolute top-3 right-3 flex gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditWorkout(workout);
                    }}
                    className="text-gray-500 hover:text-blue-600 active:scale-95 transition-transform"
                    title="Edit"
                  >
                    <FiEdit className="text-lg" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteWorkout(workout);
                    }}
                    className="text-gray-500 hover:text-red-500 active:scale-95 transition-transform"
                    title="Delete"
                  >
                    <FiTrash2 className="text-lg" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Modal Section */}
      <AnimatePresence>
        {selectedWorkout && (
          <WorkoutModal
            selectedWorkout={selectedWorkout}
            setSelectedWorkout={setSelectedWorkout}
          />
        )}
        {editWorkout && (
          <EditWorkoutModal
            workout={editWorkout}
            onClose={() => setEditWorkout(null)}
            onSave={(workout) => {
              updateWorkout(workout, dispatch, setisBusy, setErrorPopup);
            }}
          />
        )}
        {deleteWorkout && (
          <ModalPopupSubmit
            title="Delete Workout"
            message="Are you sure? This workout will be permanently removed."
            onClose={() => setDeleteWorkout(null)}
            onSubmit={() =>
              removeWorkout(
                deleteWorkout,
                setDeleteWorkout,
                setisBusy,
                dispatch,
                setErrorPopup,
              )
            }
          />
        )}
        {errorPopup && (
          <ModalPopup
            title="Error"
            message="Error in updating the Workout."
            onClose={() => setErrorPopup(false)}
          />
        )}
      </AnimatePresence>

      {(isLoading || isBusy) && <LoadingOverlay />}
    </div>
  );
};

export default WorkoutPage;
