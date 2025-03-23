import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Timer = () => {
  const [time, setTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(300); // Default 5 mins
  const [audio] = useState(new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')); // Public royalty-free audio

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => setTime((prev) => prev - 1), 1000);
    } else if (time === 0 && isRunning) {
      setIsRunning(false);
      audio.pause();
      if (Notification.permission === 'granted') {
        new Notification('Timer Done!', { body: 'Relaxation session complete!' });
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, time, audio]);

  const startTimer = () => {
    setTime(duration);
    setIsRunning(true);
    audio.loop = true;
    audio.play();
  };

  const pauseTimer = () => {
    setIsRunning(false);
    audio.pause();
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTime(0);
    audio.pause();
    audio.currentTime = 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
    >
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Relaxation Timer</h1>
      <div className="text-5xl font-mono text-center mb-6">
        {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Set Duration (minutes):</label>
        <input
          type="number"
          min="1"
          value={duration / 60}
          onChange={(e) => setDuration(e.target.value * 60)}
          disabled={isRunning}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={startTimer}
          disabled={isRunning}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          Start
        </button>
        <button
          onClick={pauseTimer}
          disabled={!isRunning}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-400"
        >
          Pause
        </button>
        <button
          onClick={stopTimer}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Stop
        </button>
      </div>
      <p className="text-sm text-gray-600 mt-4 text-center">
        Plays a soothing track (SoundHelix sample). Enjoy your relaxation!
      </p>
    </motion.div>
  );
};

export default Timer;
