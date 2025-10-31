import React, { useEffect } from 'react';
import ProfileItem from './Components/ProfileItem';
import { useNavigate } from 'react-router';
import { logoutUser } from '../../services/homePageService';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import LoadingOverlay from '../../Components/LoadingOverlay';
import { getUserData } from '../../store/User/UserSlice';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user == null) dispatch(getUserData());
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-50">
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        {user && (
          <motion.div
            className="bg-white shadow-xl rounded-xl p-8 w-full max-w-3xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {/* Top Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
              {/* Profile Image */}
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <img
                  src="https://www.gravatar.com/avatar/?d=mp"
                  alt="User"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-300 shadow-sm"
                />
              </div>

              {/* Name and Personal Info */}
              <div className="flex-1 w-full space-y-4 text-center md:text-left">
                <div>
                  <h2 className="text-3xl font-bold text-blue-800">
                    {user.username}
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ProfileItem label="Age" value={`${user.age} yrs`} />
                  <ProfileItem label="Height" value={`${user.height} cm`} />
                  <ProfileItem label="Weight" value={`${user.weight} kg`} />
                  <ProfileItem label="Gender" value={user.gender} />
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-300 my-10" />

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-lg font-medium text-gray-700">
                  Total Workouts
                </p>
                <p className="text-4xl font-bold text-blue-600">
                  {user._count?.workouts ?? 0}
                </p>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => logoutUser(navigate)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full transition duration-200"
              >
                Logout
              </motion.button>
            </div>
          </motion.div>
        )}
        {isLoading && <LoadingOverlay />}
      </main>
    </div>
  );
};

export default Profile;
