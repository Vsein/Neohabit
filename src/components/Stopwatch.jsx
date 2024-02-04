import React from 'react';
import { useDispatch } from 'react-redux';
import { Icon } from '@mdi/react';
import { mdiPause, mdiPlay, mdiRestart, mdiFlagCheckered, mdiFullscreen } from '@mdi/js';
import { useGetStopwatchQuery } from '../state/wrappers/stopwatch';
import { useGetHabitsQuery } from '../state/wrappers/habit';
import { changeTo } from '../state/features/overlay/overlaySlice';
import useStopwatch from '../hooks/useStopwatch';
import useKeyPress from '../hooks/useKeyPress';

export default function Stopwatch() {
  const stopwatch = useGetStopwatchQuery();

  return (
    <footer className="stopwatch">{stopwatch.isLoading ? <></> : <StopwatchContents />}</footer>
  );
}

function StopwatchContents() {
  const stopwatch = useGetStopwatchQuery();
  const habits = useGetHabitsQuery();

  const dispatch = useDispatch();
  const openFullscreenStopwatch = () => {
    dispatch(changeTo({ type: 'stopwatch' }));
  };
  useKeyPress(['f'], openFullscreenStopwatch);

  const [
    currentDuration,
    baseDuration,
    { togglePause, resetStopwatch, finishCountdown, clockify },
  ] = useStopwatch();

  if (habits.isFetching) return <></>;

  const habit = habits.data.find((habito) => habito._id === stopwatch?.data?.habit?._id) ?? {
    name: 'No habit',
    color: '#aabbcc',
  };

  return (
    <>
      <div className="progressbar">
        <div
          className="progressbar-progress"
          style={{
            width: `${(currentDuration / baseDuration) * 100}vw`,
            backgroundColor: habit?.color,
          }}
        ></div>
        <h3 className="progressbar-progress-countdown time">{clockify(currentDuration)}</h3>
        <h3 className="progressbar-progress-countdown time-left">{clockify(baseDuration)}</h3>
      </div>
      <div className="progressbar-controls">
        <button
          className="logo-section centering stopwatch-icon"
          onClick={resetStopwatch}
          title="Reset [R]"
        >
          <Icon path={mdiRestart} style={{ marginTop: '3px' }} className="icon medium" />
        </button>
        <button
          className="logo-section centering stopwatch-icon"
          onClick={togglePause}
          title={stopwatch.data.is_paused ? 'Play [p]' : 'Pause [p]'}
        >
          <Icon path={stopwatch.data.is_paused ? mdiPlay : mdiPause} className="icon big" />
        </button>
        <button
          className="logo-section centering stopwatch-icon"
          onClick={(e) => habit?._id && finishCountdown(e)}
          title="Finish [F]"
          disabled={!habit?._id}
        >
          <Icon path={mdiFlagCheckered} style={{ marginTop: '-1px' }} className="icon medium" />
        </button>
        <h3 className="progressbar-text">{habit?.name}</h3>
        <button
          className="logo-section centering right stopwatch-icon"
          onClick={openFullscreenStopwatch}
          title="Fullscreen [f]"
        >
          <Icon path={mdiFullscreen} className="icon medium" />
        </button>
      </div>
    </>
  );
}
