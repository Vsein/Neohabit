import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { close } from '../state/features/overlay/overlaySlice';
import useKeyPress from '../hooks/useKeyPress';
import HabitModal from './HabitModal';
import TaskModal from './TaskModal';
import ProjectModal from './ProjectModal';
import SkilltreeModal from './SkilltreeModal';
import SkillNodeModal from './SkillNodeModal';
import AccountDeleteModal from './AccountDeleteModal';
import StopwatchModal from './StopwatchModal';

export default function Overlay() {
  const dispatch = useDispatch();
  const { type, isActive, taskID, habitID, projectID, skilltreeID, skillID, skillparentID } =
    useSelector((state) => state.overlay);

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
      {type === 'skilltree' ? (
        <SkilltreeModal skilltreeID={skilltreeID} closeOverlay={closeOverlay} />
      ) : (
        <></>
      )}
      {type === 'skillNode' ? (
        <SkillNodeModal
          skilltreeID={skilltreeID}
          skillID={skillID}
          skillparentID={skillparentID}
          closeOverlay={closeOverlay}
        />
      ) : (
        <></>
      )}
      {type === 'deleteAccount' ? <AccountDeleteModal closeOverlay={closeOverlay} /> : <></>}
      {type === 'stopwatch' ? <StopwatchModal closeOverlay={closeOverlay} /> : <></>}
    </div>
  );
}
