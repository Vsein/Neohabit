import React from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import Task from './Task';
import { changeTo } from '../state/features/taskOverlay/taskOverlaySlice';

export default function Tasklist(params) {
  const { name, tasks, projectID, list } = params;
  const dispatch = useDispatch();

  const isInThisCategory = (task) => {
    if (list === 'project') return task?.project?._id === projectID;
    if (list === 'this-week') return false;
    if (list === 'today') return false;
    return true;
  };

  const addTask = (e) => {
    dispatch(changeTo({ taskID: '', projectID }));
  }

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
              <Task task={task} project={task?.project} />
            </li>
          ))}
        <button className="add-task-btn" onClick={addTask}>
          <Icon className="add-task-icon" path={mdiPlus} />
          <p>Add task</p>
        </button>
      </ul>
      <Outlet />
    </>
  );
}
