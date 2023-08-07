import React, { useState, useEffect } from 'react';
import Icon from '@mdi/react';
import {
  mdiPause,
  mdiPlay,
  mdiRestart,
  mdiFlagCheckered,
} from '@mdi/js';
import {
  useGetStopwatchQuery,
  useUpdateStopwatchMutation,
  useFinishStopwatchMutation,
} from '../state/services/stopwatch';
import useKeyPress from '../hooks/useKeyPress';

export default function Stopwatch() {
  const stopwatch = useGetStopwatchQuery();
  const [isPaused, setIsPaused] = useState(stopwatch.data.is_paused);
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
      Math.floor(
        Math.abs((Date.now() - new Date(stopwatch.data.start_time)) / 1000),
      ) - stopwatch.data.pause_duration
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
    if (!isPaused) {
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
    setIsPaused(!isPaused);
  };

  useKeyPress(['p'], togglePause);

  const resetStopwatch = () => {
    updateStopwatch({
      values: {
        is_paused: true,
        is_initiated: false,
        pause_duration: 0,
        duration: 0,
      },
    });
    setIsPaused(true);
    setCurrentDuration(0);
    document.title = '0:00:00 | Neohabit';
  };

  useKeyPress(['r'], resetStopwatch);

  const finishCountdown = () => {
    finishStopwatch({ values: { ...stopwatch.data } });
    setIsPaused(true);
    setCurrentDuration(0);
    document.title = '0:00:00 | Neohabit';
  };

  useKeyPress(['f'], finishCountdown);

  useEffect(() => {
    if (!isPaused) {
      let timerInterval = setInterval(() => {
        const recalc = calcCurrentDuration();
        setCurrentDuration(recalc);
        document.title = `${clockify(recalc)} | Neohabit`;
      }, 1000);
      // Clear interval if the component is unmounted
      return () => clearInterval(timerInterval);
    }
  });

  return (
    <footer className="stopwatch">
      <div className="progressbar">
        <div
          className="progressbar-progress"
          style={{
            width: `${(currentDuration / baseDuration) * 100}vw`,
            backgroundColor: stopwatch.data?.project?.color,
          }}
        ></div>
        <h3 className="progressbar-progress-countdown time">
          {clockify(currentDuration)}
        </h3>
        <h3 className="progressbar-progress-countdown time-left">
          {clockify(baseDuration)}
        </h3>
      </div>
      <div className="progressbar-controls">
        <h3>{stopwatch.data?.project?.name}</h3>
        <button
          className="logo-section sidebar-toggle-container centering right stopwatch-icon"
          onClick={resetStopwatch}
          title="Reset [R]"
        >
          <Icon path={mdiRestart} className="icon medium sidebar-toggle" />
        </button>
        <button
          className="logo-section sidebar-toggle-container centering stopwatch-icon"
          onClick={togglePause}
          title={isPaused ? 'Play [P]' : 'Pause [P]'}
        >
          <Icon
            path={isPaused ? mdiPlay : mdiPause}
            className="icon big sidebar-toggle"
          />
        </button>
        <button
          className="logo-section sidebar-toggle-container centering stopwatch-icon"
          onClick={finishCountdown}
          title="Finish [F]"
        >
          <Icon
            path={mdiFlagCheckered}
            className="icon medium sidebar-toggle"
          />
        </button>
      </div>
    </footer>
  );
}
