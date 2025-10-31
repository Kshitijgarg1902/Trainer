import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ClipboardIcon,
  FireIcon,
  UserCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchTemplates } from '../../../store/Template/TemplateSlice';
import NewWorkoutDialogBox from './NewWorkoutDialogBox';
import LoadingOverlay from '../../../Components/LoadingOverlay';

const tabs = [
  { name: 'Templates', path: '/templates', icon: ClipboardIcon },
  { name: 'Workouts', path: '/workouts', icon: FireIcon },
  { name: 'Profile', path: '/profile', icon: UserCircleIcon },
];

const Navbar: React.FC = () => {
  const location = useLocation();

  const [isOpen, setIsOpen] = React.useState(false);

  const { templates, isLoading } = useSelector(
    (state: RootState) => state.template,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    templates.length < 1 && dispatch(fetchTemplates());
  }, []);

  return (
    <nav
      className={`
      fixed w-full bg-blue-500 border-t md:border-t-0 md:border-b border-blue-300 
      bottom-0 md:top-0 md:bottom-auto 
      flex flex-col md:flex-row md:justify-between items-center 
      px-4 py-2 md:py-4 z-50
    `}
    >
      {/* Desktop Logo */}
      <div className="hidden md:flex items-center mx-12 font-extrabold tracking-tight text-5xl text-white">
        <h1>Trainer</h1>
      </div>

      {/* Nav Tabs */}
      <div className="flex w-full md:w-auto justify-around md:justify-end md:space-x-8 md:mx-12 items-center">
        {tabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.path);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              to={tab.path}
              className={`
              flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2
              px-4 md:px-6 py-2 md:py-3
              text-xs md:text-base tracking-wide font-medium rounded-md
              ${isActive ? 'text-white font-semibold bg-blue-600/30' : 'text-white/90'} 
              hover:text-white hover:bg-blue-600/20 
              transition duration-200 ease-in-out
            `}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </Link>
          );
        })}

        {/* Desktop Button */}
        <button
          className={`
          hidden md:flex items-center gap-2
          bg-white text-blue-600 font-semibold
          px-4 py-2 rounded-md shadow-md
          hover:bg-blue-100 transition
        `}
          onClick={() => setIsOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5" />
          <span>New Workout</span>
        </button>

        {/* Mobile Button (Icon Only) */}
        <button
          className="md:hidden flex flex-col items-center justify-center gap-1 px-4 py-2 text-white hover:text-white/90"
          onClick={() => setIsOpen(true)}
        >
          <PlusCircleIcon className="w-6 h-6" />
          <span className="text-xs">New</span>
        </button>
      </div>

      <NewWorkoutDialogBox
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        templates={templates}
      />
      {isLoading && <LoadingOverlay />}
    </nav>
  );
};

export default Navbar;
