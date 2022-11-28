import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiPlus, mdiClose } from '@mdi/js';
import { fetchTasks, fetchProjectByID, deleteTask } from '../../utils/todolist';
import { useGetTasksQuery } from '../../state/services/todolist';

export default function Editor() {
  const tasks = useGetTasksQuery();
  const { list, projectID } = useParams();
  const navigate = useNavigate();

  const isInThisCategory = (task) => {
    if (list === 'project') return task.project._id === projectID;
    if (list === 'this-week') return false;
    if (list === 'today') return false;
    return true;
  };

  const delinkify = (str) =>
    str
      .toLowerCase()
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');

  const delist = delinkify(list);

  return tasks.isFetching ? (
    <> </>
  ) : (
    <div className="editor">
      <div className="editor-header">
        <h3 id="list-name">
          {list !== 'project' ? delist : tasks.data[0]?.project.name}
        </h3>
      </div>
      <ul className="editor-list">
        {tasks.data
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
    </div>
  );
}

function Task(props) {
  const { task, project } = props;
  const [completed, setCompleted] = useState(task.completed);
  const navigate = useNavigate();

  const deleteThisTask = (e) => {
    e.stopPropagation();
    deleteTask(task._id);
    e.target.parentElement.parentElement.remove();
  };

  const completeTask = (e) => {
    e.stopPropagation();
    Storage.completeTask(project.name, task.name);
    setCompleted(!completed);
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
