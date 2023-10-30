import React from 'react';
import Icon from '@mdi/react';
import { mdiClose, mdiPause, mdiPlay, mdiRestart, mdiFlagCheckered } from '@mdi/js';
import { useGetStopwatchQuery } from '../state/services/stopwatch';
import useStopwatch from '../hooks/useStopwatch';
import HabitTag from './HabitTag';

export default function StopwatchModal({ closeOverlay }) {
  const stopwatch = useGetStopwatchQuery();

  if (stopwatch.isLoading) {
    return <></>;
  }

  const [
    currentDuration,
    baseDuration,
    { togglePause, resetStopwatch, finishCountdown, clockify },
  ] = useStopwatch();

  return (
    <div
      className="modal modal-active"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <div className="tag">
          <HabitTag habit={stopwatch.data?.habit} />
        </div>
        <button
          className="icon small"
          onClick={closeOverlay}
          type="button"
          title="Close [C]"
        >
          <Icon path={mdiClose} />
        </button>
      </div>
      <div className="modal-details centering">
        <h3 className="progressbar-circle-countdown goal">{clockify(baseDuration)}</h3>
        <div
          className="progressbar-circle centering"
          style={{
            '--color': stopwatch.data?.habit?.color,
            '--progress': `${(currentDuration / baseDuration) * 100}%`,
          }}
        >
          <h3
            className="progressbar-circle-projectname"
            style={{ color: stopwatch.data?.habit?.color }}
          >
            {stopwatch.data?.habit?.name}
          </h3>
          <h1 className="progressbar-circle-countdown">{clockify(currentDuration)}</h1>
          <div className="progressbar-controls">
            <button
              className="logo-section centering stopwatch-icon"
              onClick={resetStopwatch}
              title="Reset [R]"
            >
              <Icon
                path={mdiRestart}
                style={{ marginTop: '3px' }}
                className="icon medium"
              />
            </button>
            <button
              className="logo-section centering stopwatch-icon"
              onClick={togglePause}
              title={stopwatch.data.is_paused ? 'Play [P]' : 'Pause [P]'}
            >
              <Icon
                path={stopwatch.data.is_paused ? mdiPlay : mdiPause}
                className="icon big"
              />
            </button>
            <button
              className="logo-section centering stopwatch-icon"
              onClick={finishCountdown}
              title="Finish [F]"
            >
              <Icon
                path={mdiFlagCheckered}
                style={{ marginTop: '-1px' }}
                className="icon medium"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
