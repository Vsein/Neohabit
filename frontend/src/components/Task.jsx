import React from 'react';
import { useDispatch } from 'react-redux';
import { Icon } from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { useUpdateTaskMutation, useDeleteTaskMutation } from '../state/services/todolist';
import { changeTo } from '../state/features/overlay/overlaySlice';

export default function Task({ task }) {
  const dispatch = useDispatch();
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const habit = task?.habit || { name: 'Default', color: '#8a8a8a' };

  const deleteThisTask = (e) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  const completeTask = (e) => {
    e.stopPropagation();
    updateTask({
      taskID: task.id,
      values: { is_completed: !task.is_completed },
    });
  };

  const bg = task.is_completed
    ? `radial-gradient(${habit?.color} 30%, ${habit?.color}33 40%)`
    : `${habit?.color}33`;

  const openOverlay = (e) => {
    dispatch(changeTo({ taskID: task.id, habitID: habit?.id, type: 'task' }));
  };

  return (
    <div className="task" onClick={openOverlay}>
      <button
        className="checkbox"
        style={{ borderColor: habit?.color, background: bg }}
        onClick={completeTask}
      />
      <p tabIndex="0" className="task-name">
        {task.name}
      </p>
      <button className="centering" onClick={deleteThisTask}>
        <Icon path={mdiClose} className="icon small" />
      </button>
    </div>
  );
}
