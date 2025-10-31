import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import ErrorBoundary from './Components/ErrorBoundary';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Navbar from './pages/HomePage/Components/NavBar';
import MainPage from './Components/MainPage';
import NewWorkout from './pages/NewWorkoutPage/NewWorkoutPage';

const AppRoutes = () => {
  const location = useLocation();

  const hideNavbar =
    location.pathname === '/' || location.pathname === '/newWorkout';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/*" element={<MainPage />} />
        <Route path="/newWorkout" element={<NewWorkout />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <AppRoutes />
        </Router>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
