import React from 'react';
import { useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import { mdiPause, mdiPlay, mdiRestart, mdiFlagCheckered, mdiFullscreen } from '@mdi/js';
import { useGetStopwatchQuery } from '../state/services/stopwatch';
import { open } from '../state/features/stopwatchFullscreen/stopwatchFullscreenSlice';
import useStopwatch from '../hooks/useStopwatch';

export default function Stopwatch() {
  const stopwatch = useGetStopwatchQuery();

  return (
    <footer className="stopwatch">{stopwatch.isLoading ? <></> : <StopwatchContents />}</footer>
  );
}

function StopwatchContents() {
  const stopwatch = useGetStopwatchQuery();

  const dispatch = useDispatch();
  const openFullscreenStopwatch = () => {
    dispatch(open());
  };

  const [
    currentDuration,
    baseDuration,
    { togglePause, resetStopwatch, finishCountdown, clockify },
  ] = useStopwatch();

  return (
    <>
      <div className="progressbar">
        <div
          className="progressbar-progress"
          style={{
            width: `${(currentDuration / baseDuration) * 100}vw`,
            backgroundColor: stopwatch.data?.habit?.color,
          }}
        ></div>
        <h3 className="progressbar-progress-countdown time">{clockify(currentDuration)}</h3>
        <h3 className="progressbar-progress-countdown time-left">{clockify(baseDuration)}</h3>
      </div>
      <div className="progressbar-controls">
        <button
          className="logo-section sidebar-toggle-container centering stopwatch-icon"
          onClick={resetStopwatch}
          title="Reset [R]"
        >
          <Icon
            path={mdiRestart}
            style={{ marginTop: '3px' }}
            className="icon medium sidebar-toggle"
          />
        </button>
        <button
          className="logo-section sidebar-toggle-container centering stopwatch-icon"
          onClick={togglePause}
          title={stopwatch.data.is_paused ? 'Play [P]' : 'Pause [P]'}
        >
          <Icon
            path={stopwatch.data.is_paused ? mdiPlay : mdiPause}
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
            style={{ marginTop: '-1px' }}
            className="icon medium sidebar-toggle"
          />
        </button>
        <h3 className="progressbar-text">{stopwatch.data?.habit?.name}</h3>
        <button
          className="logo-section sidebar-toggle-container centering right stopwatch-icon"
          onClick={openFullscreenStopwatch}
          title="Fullscreen [F]"
        >
          <Icon path={mdiFullscreen} className="icon medium sidebar-toggle" />
        </button>
      </div>
    </>
  );
}
