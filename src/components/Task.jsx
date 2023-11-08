import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { useUpdateTaskMutation, useDeleteTaskMutation } from '../state/services/todolist';
import { changeTo } from '../state/features/overlay/overlaySlice';

export default function Task(props) {
  const { task } = props;
  const dispatch = useDispatch();
  const [deleteTask, { isLoading }] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const habit = task?.habit || { name: 'Default', color: '#8a8a8a' };

  const deleteThisTask = (e) => {
    e.stopPropagation();
    deleteTask(task._id);
  };

  const completeTask = (e) => {
    e.stopPropagation();
    updateTask({
      taskID: task._id,
      values: { ...task, completed: !task.completed },
    });
  };

  const bg = task.completed
    ? `radial-gradient(${habit?.color} 30%, ${habit?.color}33 40%)`
    : `${habit?.color}33`;

  const openOverlay = (e) => {
    dispatch(changeTo({ taskID: task._id, habitID: habit?._id, type: 'task' }));
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
