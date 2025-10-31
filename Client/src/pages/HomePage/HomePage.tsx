import React, { useState } from 'react';
import mainImage from '../../assets/MainImage.jpg';
import Login from './Components/Login';
import Signup from './Components/Signup';

const HomePage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <main className="h-screen bg-gray-100 overflow-hidden">
      <div
        className="flex flex-col h-full md:flex-row md:max-w-6xl md:mx-auto md:my-[12.5vh]
               md:h-[75vh] md:shadow-lg md:rounded-xl overflow-hidden"
      >
        <section className="relative flex-1">
          <img
            src={mainImage}
            className="h-full w-full object-cover"
            alt="Main"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white/80 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold">Trainer</h1>
            <div className="mt-4 space-x-4 text-sm md:text-base font-medium">
              <span>Log Workouts</span>
              <span>•</span>
              <span>Build Muscles</span>
              <span>•</span>
              <span>Track Progress</span>
            </div>
          </div>
        </section>

        {isLogin ? (
          <Login setIsLogin={setIsLogin} />
        ) : (
          <Signup setIsLogin={setIsLogin} />
        )}
      </div>
    </main>
  );
};

export default HomePage;
