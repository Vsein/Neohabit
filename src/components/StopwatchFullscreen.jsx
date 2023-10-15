import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import { mdiClose, mdiPause, mdiPlay, mdiRestart, mdiFlagCheckered } from '@mdi/js';
import { close } from '../state/features/stopwatchFullscreen/stopwatchFullscreenSlice';
import { useGetStopwatchQuery } from '../state/services/stopwatch';
import useKeyPress from '../hooks/useKeyPress';
import useStopwatch from '../hooks/useStopwatch';
import HabitTag from './HabitTag';

export default function StopwatchFullscreen() {
  const stopwatch = useGetStopwatchQuery();
  const dispatch = useDispatch();
  const { isActive } = useSelector((state) => state.stopwatchFullscreen);

  const closeOverlay = (e) => {
    e.stopPropagation();
    dispatch(close());
  };

  useKeyPress(['c'], closeOverlay);

  if (stopwatch.isLoading) {
    return <></>;
  }

  const [
    currentDuration,
    baseDuration,
    { togglePause, resetStopwatch, finishCountdown, clockify },
  ] = useStopwatch();

  return (
    <div className={isActive ? 'overlay overlay-active' : 'overlay'} onMouseDown={closeOverlay}>
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
            className="close-modal-button icon"
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
              '--progress': `${currentDuration / baseDuration * 100}%`,
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
