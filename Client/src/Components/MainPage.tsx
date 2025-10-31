import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../services/ProtectedRoute';
import TemplatePage from '../pages/TemplatePage/TemplatePage';
import WorkoutPage from '../pages/WorkoutPage/WorkoutPage';
import Profile from '../pages/ProfilePage/Profile';
import { fetchTemplates } from '../store/Template/TemplateSlice';
import { AppDispatch, RootState } from '../store/store';
import { fetchExerciseData } from '../store/Exercise/ExerciseSlice';
import LoadingOverlay from './LoadingOverlay';

const MainPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const templates = useSelector((state: RootState) => state.template.templates);
  const templatesLoading = useSelector(
    (state: RootState) => state.template.isLoading,
  );

  const exercises = useSelector((state: RootState) => state.exercise.exercises);
  const exercisesLoading = useSelector(
    (state: RootState) => state.exercise.isLoading,
  );

  useEffect(() => {
    if (templates.length === 0) dispatch(fetchTemplates());
    if (exercises.length === 0) dispatch(fetchExerciseData());
  }, [dispatch, templates.length, exercises.length]);

  const isLoading = templatesLoading || exercisesLoading;

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/templates"
            element={<TemplatePage templates={templates} />}
          />
          <Route path="/workouts" element={<WorkoutPage />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
};

export default MainPage;
