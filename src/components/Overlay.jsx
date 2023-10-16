import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { close } from '../state/features/overlay/overlaySlice';
import useKeyPress from '../hooks/useKeyPress';
import HabitModal from './HabitModal';
import TaskModal from './TaskModal';
import ProjectModal from './ProjectModal';
import AccountDeleteModal from './AccountDeleteModal';

export default function Overlay() {
  const dispatch = useDispatch();
  const { type, isActive, taskID, habitID, projectID } = useSelector((state) => state.overlay);

  const closeOverlay = (e) => {
    e.stopPropagation();
    dispatch(close());
  };

  useKeyPress(['c'], closeOverlay);

  return (
    <div className={isActive ? 'overlay overlay-active' : 'overlay'} onMouseDown={closeOverlay}>
      {type === 'habit' ? (
        <HabitModal habitID={habitID} projectID={projectID} closeOverlay={closeOverlay} />
      ) : (
        <></>
      )}
      {type === 'task' ? (
        <TaskModal taskID={taskID} habitID={habitID} closeOverlay={closeOverlay} />
      ) : (
        <></>
      )}
      {type === 'project' ? (
        <ProjectModal isActive={isActive} projectID={projectID} closeOverlay={closeOverlay} />
      ) : (
        <></>
      )}
      {type === 'deleteAccount' ? <AccountDeleteModal closeOverlay={closeOverlay} /> : <></>}
    </div>
  );
}
