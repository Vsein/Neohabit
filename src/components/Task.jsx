import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import {
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from '../state/services/todolist';

export default function Task(props) {
  const { task, project } = props;
  const [completed, setCompleted] = useState(task.completed);
  const [deleteTask, { isLoading }] = useDeleteTaskMutation()
  const [updateTask] = useUpdateTaskMutation()
  const navigate = useNavigate();

  const deleteThisTask = (e) => {
    e.stopPropagation();
    deleteTask(task._id);
  };

  const completeTask = (e) => {
    e.stopPropagation();
    setCompleted(!completed);
    updateTask({ taskID: task._id, values: { ...task, completed: !completed } });
  };

  const bg = completed
    ? `radial-gradient(${project.color} 30%, ${project.color}33 40%)`
    : `${project.color}33`;

  return (
    <div className="task" onClick={() => navigate(`task/${task._id}`)}>
      <button
        className="checkbox"
        style={{ borderColor: project.color, background: bg }}
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
