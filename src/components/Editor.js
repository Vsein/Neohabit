import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiPlus, mdiClose } from '@mdi/js';
import Storage from '../modules/Storage';
import { fetchTasks } from '../api/get';

export default function Editor(props) {
  const { open } = props;
  const { list, id } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function init() {
      const tasksRes = await fetchTasks({ [list.replace('-', '_')]: true, id });
      setTasks(tasksRes);
    }

    init();
  }, [list, id]);

  const delinkify = (str) =>
    str
      .toLowerCase()
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');

  const delist = delinkify(list);

  const openNew = () => {
    const project = Storage.getToDoList().getProject(list);
    open({ isNew: true, task: {}, project });
  };

  return (
    <main className="editor">
      <div className="editor-header">
        <h3 id="list-name">{delist}</h3>
      </div>
      <ul className="editor-list">
        {
          tasks.map((task) => (
              <li key={task.name}>
                <Task task={task} project={task.project} open={open} />
              </li>
          ))
        }
        <button className="add-task-btn" onClick={openNew}>
          <Icon className="add-task-icon" path={mdiPlus} />
          <p>Add task</p>
        </button>
      </ul>
    </main>
  );
}

function Task(props) {
  const { task, project, open } = props;
  const [completed, setCompleted] = useState(task.completed);

  const deleteTask = (e) => {
    e.stopPropagation();
    Storage.deleteTask(project.name, task.name);
    e.target.parentElement.remove();
  };

  const completeTask = (e) => {
    e.stopPropagation();
    Storage.completeTask(project.name, task.name);
    setCompleted(!completed);
  };

  const bg = completed
    ? `radial-gradient(${project.color} 30%, ${project.color}33 40%)`
    : `${project.color}33`;

  const openTask = (e) => {
    e.stopPropagation();
    open({ isNew: false, task, project });
  };

  return (
    <div className="task" onClick={openTask}>
      <button
        className="checkbox"
        style={{ borderColor: project.color, background: bg }}
        onClick={completeTask}
      ></button>
      <button tabIndex="0" onClick={openTask} className="task-name">{task.name}</button>
      <button className="centering">
        <Icon path={mdiClose} className="delete-task-btn icon" onClick={deleteTask} />
      </button>
    </div>
  );
}
