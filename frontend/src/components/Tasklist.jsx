import React from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook'
import { Icon } from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import Task from './Task';
import { changeTo, close } from '../state/features/overlay/overlaySlice';

export default function Tasklist(params) {
  const { name, tasks, habitID, list } = params;
  const dispatch = useDispatch();

  const isInThisCategory = (task) => {
    if (list === 'habit') return task?.habit?._id === habitID;
    if (list === 'this-week') return false;
    if (list === 'today') return false;
    return true;
  };

  const { type, isActive } = useSelector((state) => state.overlay);
  const addTask = (e) => {
    if (type === 'task' && isActive) {
      dispatch(close());
    } else {
      dispatch(changeTo({ taskID: '', habitID, type: 'task' }));
    }
  };
  useHotkeys('t', addTask);

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
