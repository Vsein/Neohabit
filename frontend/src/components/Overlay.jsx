import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { close } from '../state/features/overlay/overlaySlice';
import HabitModal from './HabitModal';
import TaskModal from './TaskModal';
import ProjectModal from './ProjectModal';
import SkilltreeModal from './SkilltreeModal';
import SkillNodeModal from './SkillNodeModal';
import { useDeleteProjectMutation } from '../state/services/project';
import { useDeleteHabitMutation } from '../state/services/habit';
import { useDeleteSkilltreeMutation } from '../state/services/skilltree';
import { useDeleteSelfMutation } from '../state/services/settings';
import DeleteModal from './DeleteModal';
import StopwatchModal from './StopwatchModal';

export default function Overlay() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    type,
    isActive,
    taskID,
    habitID,
    projectID,
    project,
    skilltreeID,
    skillID,
    skillparentID,
  } = useSelector((state) => state.overlay);

  const [deleteProject] = useDeleteProjectMutation();
  const [deleteHabit] = useDeleteHabitMutation();
  const [deleteSkilltree] = useDeleteSkilltreeMutation();
  const [deleteSelf] = useDeleteSelfMutation();

  const closeOverlay = (e) => {
    e.stopPropagation();
    const cellAddDropdown = document.querySelector('.cell-add-dropdown');
    cellAddDropdown.classList.add('hidden');
    dispatch(close());
  };

  useHotkeys('esc, c', closeOverlay);

  if (!isActive) return <></>;

  return (
    <div
      className={isActive ? 'overlay overlay-active centering' : 'overlay'}
      onMouseDown={closeOverlay}
    >
      {type === 'habit' && (
        <HabitModal habitID={habitID} projectID={projectID} closeOverlay={closeOverlay} />
      )}
      {type === 'task' && (
        <TaskModal taskID={taskID} habitID={habitID} closeOverlay={closeOverlay} />
      )}
      {type === 'project' && (
        <ProjectModal
          isActive={isActive}
          projectID={projectID}
          project={project}
          closeOverlay={closeOverlay}
        />
      )}
      {type === 'skilltree' && (
        <SkilltreeModal skilltreeID={skilltreeID} closeOverlay={closeOverlay} />
      )}
      {type === 'skillNode' && (
        <SkillNodeModal
          skilltreeID={skilltreeID}
          skillID={skillID}
          skillparentID={skillparentID}
          closeOverlay={closeOverlay}
        />
      )}
      {type === 'deleteAccount' && (
        <DeleteModal
          title="your account"
          deleteOnClick={async () => {
            await deleteSelf();
            localStorage.removeItem('token');
            dispatch({ type: 'RESET' });
            navigate('/login');
          }}
          closeOverlay={closeOverlay}
        />
      )}
      {type === 'deleteHabit' && (
        <DeleteModal
          title="the habit"
          deleteOnClick={async (e) => {
            await deleteHabit(habitID);
            closeOverlay(e);
          }}
          closeOverlay={closeOverlay}
        />
      )}
      {type === 'deleteProject' && (
        <DeleteModal
          title="the project"
          deleteOnClick={async (e) => {
            await deleteProject(projectID);
            closeOverlay(e);
          }}
          closeOverlay={closeOverlay}
        />
      )}
      {type === 'deleteSkilltree' && (
        <DeleteModal
          title="the skilltree"
          deleteOnClick={async (e) => {
            await deleteSkilltree(skilltreeID);
            closeOverlay(e);
          }}
          closeOverlay={closeOverlay}
        />
      )}
      {type === 'stopwatch' && <StopwatchModal closeOverlay={closeOverlay} />}
    </div>
  );
}
