import React from 'react';
import { Icon } from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { useGetSelfQuery } from '../state/services/settings';

function HabitTag({ habit }) {
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
          <Icon path={mdiClose} className="icon small" style={{ marginLeft: '-6px' }} />
        </div>
      </div>
      <p>{habit.name}</p>
    </>
  );
}

function AccountInfo() {
  const self = useGetSelfQuery();

  return self.isLoading ? (
    <></>
  ) : (
    <div className="account-info">
      <img alt="profile pic" className="pfp small" />
      <p>{`@${self.data.username}`}</p>
      <p className="account-username">{self.data.email}</p>
    </div>
  );
}

function ProfilePicture({ type }) {
  return (
    <div className="centering">
      <img alt="profile pic" className={`pfp ${type}`} />
    </div>
  );
}

export { HabitTag, HabitTagToDelete, AccountInfo, ProfilePicture };
