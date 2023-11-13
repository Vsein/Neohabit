import React from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import Task from './Task';
import { changeTo } from '../state/features/overlay/overlaySlice';
import useKeyPress from '../hooks/useKeyPress';

export default function Tasklist(params) {
  const { name, tasks, habitID, list } = params;
  const dispatch = useDispatch();

  const isInThisCategory = (task) => {
    if (list === 'habit') return task?.habit?._id === habitID;
    if (list === 'this-week') return false;
    if (list === 'today') return false;
    return true;
  };

  const addTask = (e) => {
    dispatch(changeTo({ taskID: '', habitID, type: 'task' }));
  };

  useKeyPress(['t'], addTask);

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
              <Task task={task} habit={task?.habit} />
            </li>
          ))}
        <button className="add-task-btn" onClick={addTask} title="Add task [T]">
          <Icon className="icon small" path={mdiPlus} />
          <p className="left">Add a new task</p>
        </button>
      </ul>
      <Outlet />
    </>
  );
}
