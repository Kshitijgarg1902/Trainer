import React, { useEffect, useRef, useState } from 'react';

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m
    .toString()
    .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};
interface TimerProps {
  timerRef: ReturnType<typeof useRef<number>>;
}

const Timer: React.FC<TimerProps> = ({ timerRef }: TimerProps) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
      timerRef.current! += 1;
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <span className="text-2xl font-mono bg-blue-100 text-blue-800 px-6 py-2 rounded-full shadow-md">
      {formatTime(secondsElapsed)}
    </span>
  );
};

export default Timer;
