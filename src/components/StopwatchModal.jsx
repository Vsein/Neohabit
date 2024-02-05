import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@mdi/react';
import { mdiClose, mdiPause, mdiPlay, mdiRestart, mdiFlagCheckered } from '@mdi/js';
import { useGetStopwatchQuery } from '../state/services/stopwatch';
import { useGetHabitsQuery } from '../state/services/habit';
import useStopwatch from '../hooks/useStopwatch';
import { HabitTag } from './UI';

export default function StopwatchModal({ closeOverlay }) {
  const stopwatch = useGetStopwatchQuery();
  const habits = useGetHabitsQuery();

  if (stopwatch.isLoading || habits.isFetching) {
    return <></>;
  }

  const [
    currentDuration,
    baseDuration,
    { togglePause, resetStopwatch, finishCountdown, clockify },
  ] = useStopwatch();

  const habit = habits.data.find((habito) => habito._id === stopwatch?.data?.habit?._id) ?? {
    name: 'No habit',
    color: '#aabbcc',
  };

  return (
    <div
      className="modal modal-active modal-stopwatch"
      style={{ gridTemplateRows: 'min-content 1fr' }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <NavLink
          className="tag"
          onClick={closeOverlay}
          to={habit?._id && `../habit/${habit?._id ?? 'Default'}`}
          title={habit.name}
        >
          <HabitTag habit={habit} />
        </NavLink>
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
            '--color': habit?.color,
            '--progress': `${(currentDuration / baseDuration) * 100}%`,
          }}
        >
          <h3
            className="progressbar-circle-projectname"
            style={{ color: habit?.color }}
          >
            {habit?.name}
          </h3>
          <h1 className="progressbar-circle-countdown">{clockify(currentDuration)}</h1>
          <div className="progressbar-controls fullscreen">
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
              onClick={(e) => habit?._id && finishCountdown(e)}
              title="Finish [F]"
              disabled={!habit?._id}
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
