import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import Task from './Task';

export default function Tasklist(params) {
  const { name, tasks, projectID, list } = params;
  const navigate = useNavigate();

  const isInThisCategory = (task) => {
    if (list === 'project') return task.project._id === projectID;
    if (list === 'this-week') return false;
    if (list === 'today') return false;
    return true;
  };

  return (
    <>
      <div className="tasklist-header">
        <h3 id="list-name">{name}</h3>
      </div>
      <ul className="tasklist-tasks">
        {tasks
          .filter((task) => isInThisCategory(task))
          .map((task) => (
            <li key={task._id}>
              <Task task={task} project={task.project} />
            </li>
          ))}
        <button className="add-task-btn" onClick={() => navigate('task/new')}>
          <Icon className="add-task-icon" path={mdiPlus} />
          <p>Add task</p>
        </button>
      </ul>
      <Outlet />
    </>
  );
}
