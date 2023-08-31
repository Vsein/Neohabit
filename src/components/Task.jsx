import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { useUpdateTaskMutation, useDeleteTaskMutation } from '../state/services/todolist';
import { changeTo, open } from '../state/features/taskOverlay/taskOverlaySlice';

export default function Task(props) {
  const { task, project } = props;
  const dispatch = useDispatch();
  const [completed, setCompleted] = useState(task.completed);
  const [deleteTask, { isLoading }] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const deleteThisTask = (e) => {
    e.stopPropagation();
    deleteTask(task._id);
  };

  const completeTask = (e) => {
    e.stopPropagation();
    setCompleted(!completed);
    updateTask({
      taskID: task._id,
      values: { ...task, completed: !completed },
    });
  };

  const bg = completed
    ? `radial-gradient(${project?.color} 30%, ${project?.color}33 40%)`
    : `${project?.color}33`;

  const openOverlay = (e) => {
    dispatch(changeTo({ taskID: task._id, projectID: project?._id }));
    dispatch(open());
  };

  return (
    <div className="task" onClick={openOverlay}>
      <button
        className="checkbox"
        style={{ borderColor: project?.color, background: bg }}
        onClick={completeTask}
      ></button>
      <button tabIndex="0" className="task-name">
        {task.name}
      </button>
      <button className="centering" onClick={deleteThisTask}>
        <Icon path={mdiClose} className="delete-task-btn icon" />
      </button>
    </div>
  );
}
