import React from 'react';
import { Icon } from '@mdi/react';
import { mdiClose, mdiPlus } from '@mdi/js';

export default function HabitTag({ habit }) {
  return (
    <>
      <div className="centering">
        <div className="habit-circle" style={{ backgroundColor: habit.color }}></div>
      </div>
      <p>{habit.name}</p>
    </>
  );
}

function HabitTagToDelete({ habit }) {
  return (
    <>
      <div className="centering">
        <div
          className="habit-circle to-delete centering"
          style={{ '--signature-color': habit.color }}
        >
          <Icon path={mdiClose} className="icon small" style={{marginLeft: '-6px' }}/>
        </div>
      </div>
      <p>{habit.name}</p>
    </>
  );
}

export { HabitTagToDelete };
