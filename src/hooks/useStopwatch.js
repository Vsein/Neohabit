import { useState, useEffect } from 'react';
import { formatISO } from 'date-fns';
import {
  useGetStopwatchQuery,
  useUpdateStopwatchMutation,
  useFinishStopwatchMutation,
} from '../state/services/stopwatch';
import useKeyPress from './useKeyPress';

export default function useStopwatch() {
  const stopwatch = useGetStopwatchQuery();
  const [updateStopwatch] = useUpdateStopwatchMutation();
  const [finishStopwatch] = useFinishStopwatchMutation();

  const calcCurrentDuration = () => {
    if (!stopwatch.data.is_initiated) {
      return 0;
    }
    if (stopwatch.data.is_paused) {
      return stopwatch.data.duration;
    }
    return (
      Math.floor(Math.abs((Date.now() - new Date(stopwatch.data.start_time)) / 1000)) -
      stopwatch.data.pause_duration
    );
  };

  const [currentDuration, setCurrentDuration] = useState(calcCurrentDuration());
  const baseDuration = 90 * 60;

  const clockify = (time) => {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time / 60) % 60);
    let seconds = Math.floor(time % 60);
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${hours}:${minutes}:${seconds}`;
  };

  const togglePause = () => {
    if (!stopwatch.data.is_paused) {
      // Pausing
      updateStopwatch({
        values: {
          is_paused: true,
          duration: calcCurrentDuration(),
        },
      });
    } else if (stopwatch.data.duration === 0) {
      // Initiation
      updateStopwatch({
        values: {
          start_time: Date.now(),
          is_initiated: true,
          is_paused: false,
        },
      });
    } else {
      // Resuming after pause
      updateStopwatch({
        values: {
          is_paused: false,
          pause_duration: Math.floor(
            Math.abs(Date.now() - new Date(stopwatch.data.start_time)) / 1000 -
              stopwatch.data.duration,
          ),
        },
      });
    }
  };

  const resetStopwatch = () => {
    updateStopwatch({
      values: {
        is_paused: true,
        is_initiated: false,
        pause_duration: 0,
        duration: 0,
      },
    });
    setCurrentDuration(0);
    document.title = '0:00:00 | Neohabit';
  };

  const finishCountdown = () => {
    finishStopwatch({
      values: {
        ...stopwatch.data,
        start_time: formatISO(new Date(stopwatch.data.start_time), { representation: 'date' }),
      },
    });
    setCurrentDuration(0);
    document.title = '0:00:00 | Neohabit';
  };

  useEffect(() => {
    if (!stopwatch.data.is_paused) {
      let timerInterval = setInterval(() => {
        const recalc = calcCurrentDuration();
        setCurrentDuration(recalc);
        document.title = `${clockify(recalc)} | Neohabit`;
      }, 1000);
      // Clear interval if the component is unmounted
      return () => clearInterval(timerInterval);
    }
    const recalc = calcCurrentDuration();
    setCurrentDuration(recalc);
  });

  useKeyPress(['p'], togglePause);
  useKeyPress(['R'], resetStopwatch);
  useKeyPress(['F'], finishCountdown);

  return [
    currentDuration,
    baseDuration,
    { togglePause, resetStopwatch, finishCountdown, clockify },
  ];
}
