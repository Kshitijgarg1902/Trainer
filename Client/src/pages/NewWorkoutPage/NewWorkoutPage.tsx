import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { cloneDeep } from 'lodash';
import { fetchExerciseData } from '../../store/Exercise/ExerciseSlice';
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';
import { newSet, SetType } from '../../types/Settypes';
import { newWorkout } from '../../types/Workouttypes';
import { Template } from '../../types/Templatetypes';
import {
  Exercise,
  ExerciseData,
  newExerciseLog,
} from '../../types/Exercisetypes';
import ExercisePicker from '../../Components/ExercisPicker';
import ModalPopupSubmit from '../../Components/ModalPopUpSubmit';
import { useNavigate } from 'react-router';
import LoadingOverlay from '../../Components/LoadingOverlay';
import { addWorkout } from '../../services/workoutPageService';
import Timer from './Components/Timer';
import ModalPopup from '../../Components/ModalPopUp';
import CustomDropdown from '../../Components/CustomSelect';

const DiscardWorkout = (navigate: ReturnType<typeof useNavigate>) => {
  localStorage.removeItem('newWorkoutTemplate');
  navigate('/workouts');
};

const NewWorkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { exercises, isLoading } = useSelector(
    (state: RootState) => state.exercise,
  );

  const timerRef = useRef<number>(0);

  const [exercisePicker, setExercisePicker] = useState<boolean>(false);
  const [discardWorkout, setDiscardWorkout] = useState<boolean>(false);
  const [finishdWorkout, setFinshWorkout] = useState<boolean>(false);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [errorPopup, setErrorPopup] = useState<boolean>(false);
  const [workout, setWorkout] = useState<newWorkout>({
    duration_minutes: 0,
    notes: null,
    exerciseslog: [],
  });

  useEffect(() => {
    if (exercises.length === 0) dispatch(fetchExerciseData());
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const raw = localStorage.getItem('newWorkoutTemplate');
      if (!raw) return;

      const template: Template = JSON.parse(raw);
      if (!template.exercises || template.exercises.length === 0) return;

      const updatedExercisesLog: newExerciseLog[] = [];

      template.exercises.forEach((ex) => {
        const exerciseDetails = exercises.find(
          (x) => x.name === ex.exerciseName,
        );
        if (!exerciseDetails) return;

        const sets: newSet[] = ex.sets.map((set, index) => {
          const prevWeight =
            exerciseDetails.exercise_logs?.[0]?.sets?.[index]?.weight ?? null;
          return {
            reps: 0,
            weight: 0,
            type: set.type,
            checked: false,
            prevWeight,
          };
        });

        updatedExercisesLog.push({
          notes: null,
          exercise: exerciseDetails,
          sets,
        });
      });

      setWorkout((prev) => ({ ...prev, exerciseslog: updatedExercisesLog }));
    }
  }, [isLoading]);

  const toggleSet = (
    exerciseIndex: number,
    setIndex: number,
    checked: boolean,
  ) => {
    setWorkout((prev) => {
      const copy = cloneDeep(prev);
      copy.exerciseslog[exerciseIndex].sets[setIndex].checked = checked;
      return copy;
    });
  };

  const removeExercise = (exerciseIndex: number) => {
    setWorkout((prev) => {
      const copy = cloneDeep(prev);
      copy.exerciseslog.splice(exerciseIndex, 1);
      return copy;
    });
  };

  const handleExerciseSelect = (selectedExercise: ExerciseData) => {
    const updatedWorkout = cloneDeep(workout);
    const set: newSet = {
      reps: 0,
      weight: 0,
      type: 'N',
      checked: false,
      prevWeight:
        selectedExercise.exercise_logs?.[0]?.sets?.[0]?.weight ?? null,
    };

    const exercise: Exercise = {
      id: selectedExercise.id,
      name: selectedExercise.name,
      category: selectedExercise.category,
      equipment: selectedExercise.equipment,
    };

    const exerciselog: newExerciseLog = {
      notes: null,
      exercise: exercise,
      sets: [],
    };

    exerciselog.sets.push(set);
    updatedWorkout.exerciseslog.push(exerciselog);

    setWorkout(updatedWorkout);
    setExercisePicker(false);
  };

  const AddSet = (exerciseIndex: number) => {
    const exerciseDetails = exercises.find(
      (x) => x.name === workout.exerciseslog[exerciseIndex].exercise.name,
    );

    if (!exerciseDetails) return;

    const lastSetNumber = workout.exerciseslog[exerciseIndex].sets.length;

    const prevWeight =
      exerciseDetails.exercise_logs?.[0]?.sets?.[lastSetNumber]?.weight ?? null;

    setWorkout((prev) => {
      const copy = cloneDeep(prev);
      const newSet = {
        reps: 0,
        weight: 0,
        type: 'N' as SetType,
        checked: false,
        prevWeight: prevWeight,
      };
      copy.exerciseslog[exerciseIndex].sets.push(newSet);
      return copy;
    });
  };

  const deleteSet = (exerciseIndex: number, setIndex: number) => {
    const exerciseDetails = exercises.find(
      (x) => x.name === workout.exerciseslog[exerciseIndex].exercise.name,
    );

    if (!exerciseDetails) return;

    const copy = cloneDeep(workout);
    copy.exerciseslog[exerciseIndex].sets.splice(setIndex, 1);

    copy.exerciseslog[exerciseIndex].sets.forEach((set, index) => {
      set.prevWeight =
        exerciseDetails.exercise_logs?.[0]?.sets?.[index]?.weight ?? null;
    });

    setWorkout(copy);
  };

  const hasAnySetChecked = workout.exerciseslog.some((exerciseLog) =>
    exerciseLog.sets.some((set) => set.checked),
  );

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50 p-4">
      <div className="bg-white w-full max-w-3xl h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        <div className="flex flex-col items-center justify-center space-y-3 mb-6">
          <h1 className="text-3xl font-bold text-blue-700">New Workout</h1>
          <Timer timerRef={timerRef} />
        </div>

        {workout.exerciseslog.map((exercise, exIndex) => (
          <div
            key={exIndex}
            className="border-t border-gray-300 py-4 transition-all duration-300 ease-in-out"
          >
            <div
              className="flex justify-between items-center cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              onClick={() =>
                setExpandedIndex(expandedIndex === exIndex ? null : exIndex)
              }
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {exercise.exercise.name}
              </h2>
              <div className="flex items-center gap-3">
                {expandedIndex === exIndex ? <ChevronUp /> : <ChevronDown />}
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeExercise(exIndex);
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                expandedIndex === exIndex
                  ? 'max-h-[1000px] mt-4 space-y-3'
                  : 'max-h-0'
              }`}
            >
              <div className="flex justify-between text-xs text-gray-500 font-medium px-2">
                <span className="w-[30px]">Set</span>
                <span className="w-[40px]">Type</span>
                <span className="w-[50px] px-4">Prev</span>
                <span className="w-[50px] px-2">Reps</span>
                <span className="w-[50px] px-2">Weight</span>
                <span className="w-[50px]"></span>
              </div>
              {exercise.sets.map((set, setIndex) => (
                <div
                  key={setIndex}
                  className={`flex justify-between py-2 px-2 text-xs rounded-md transition-colors duration-300 ${
                    set.checked ? 'bg-green-100' : 'bg-white'
                  }`}
                >
                  <span className="w-[30px] text-sm font-medium px-1">
                    {setIndex + 1}
                  </span>
                  <CustomDropdown
                    value={set.type}
                    onChange={(selectedType) => {
                      const updatedType = selectedType as SetType;
                      setWorkout((prev) => {
                        const copy = cloneDeep(prev);
                        copy.exerciseslog[exIndex].sets[setIndex].type =
                          updatedType;
                        return copy;
                      });
                    }}
                    className="w-[50px] text-xs"
                  />
                  <input
                    type="number"
                    className="bg-gray-100 text-gray-600 rounded text-center py-1 text-sm w-[50px]"
                    value={set.prevWeight ?? undefined}
                    disabled={true}
                    aria-label="Previous"
                  />
                  <input
                    type="number"
                    className="border rounded text-center py-1 text-sm w-[50px]"
                    placeholder="-"
                    value={set.reps === 0 ? '' : set.reps}
                    onChange={(e) => {
                      setWorkout((prev) => {
                        const copy = cloneDeep(prev);
                        copy.exerciseslog[exIndex].sets[setIndex].reps =
                          e.target.value === '' ? 0 : Number(e.target.value);
                        e.target.value;
                        return copy;
                      });
                    }}
                    aria-label="Reps"
                  />
                  <input
                    type="number"
                    className="border rounded text-center py-1 text-sm w-[50px]"
                    placeholder="-"
                    value={set.weight === 0 ? '' : set.weight}
                    onChange={(e) => {
                      setWorkout((prev) => {
                        const copy = cloneDeep(prev);
                        copy.exerciseslog[exIndex].sets[setIndex].weight =
                          e.target.value === '' ? 0 : Number(e.target.value);
                        e.target.value;
                        return copy;
                      });
                    }}
                    aria-label="Weight"
                  />
                  <div className="w-[50px] py-1">
                    <input
                      type="checkbox"
                      checked={set.checked}
                      onChange={(e) =>
                        toggleSet(exIndex, setIndex, e.target.checked)
                      }
                      className="w-[30px] h-[20px]"
                    />
                    {exercise.sets.length > 1 && (
                      <button
                        className="text-gray-400 hover:text-blue-600 ml-1"
                        onClick={() => {
                          deleteSet(exIndex, setIndex);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex justify-end pr-2 mt-2">
                <button
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => {
                    AddSet(exIndex);
                  }}
                >
                  <Plus size={16} /> Add Set
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-8">
          <button
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            onClick={() => setExercisePicker(true)}
          >
            <Plus size={18} /> Add Exercise
          </button>

          <div className="flex gap-4">
            <button
              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 text-sm flex items-center gap-1 font-semibold"
              onClick={() => setDiscardWorkout(true)}
            >
              <X size={16} /> Discard
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1 font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              disabled={!hasAnySetChecked}
              onClick={() => setFinshWorkout(true)}
            >
              <CheckCircle2 size={16} /> Finish Workout
            </button>
          </div>
        </div>
      </div>
      {exercisePicker && (
        <ExercisePicker
          onClose={() => setExercisePicker(false)}
          onSelect={(selectedExercise: ExerciseData) =>
            handleExerciseSelect(selectedExercise)
          }
        />
      )}
      {discardWorkout && (
        <ModalPopupSubmit
          title="Discard Workout"
          message="Are you sure you want to discard the current workout?"
          onClose={() => setDiscardWorkout(false)}
          onSubmit={() => DiscardWorkout(navigate)}
        />
      )}
      {finishdWorkout && (
        <ModalPopupSubmit
          title="Discard Workout"
          message="Are you sure you want to discard the current workout?"
          onClose={() => setFinshWorkout(false)}
          onSubmit={() =>
            addWorkout(
              workout,
              setIsBusy,
              setErrorPopup,
              dispatch,
              timerRef,
              navigate,
            )
          }
        />
      )}
      {errorPopup && (
        <ModalPopup
          title="Error"
          message="Some Error in Saving the workout."
          onClose={() => setErrorPopup(false)}
        />
      )}
      {(isLoading || isBusy) && <LoadingOverlay />}
    </div>
  );
};

export default NewWorkout;
