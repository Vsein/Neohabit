import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import Storage from '../modules/Storage';

export default function Editor(props) {
  const { open } = props;
  let { list } = useParams();

  const delinkify = (str) =>
    str
      .toLowerCase()
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');

  list = delinkify(list);

  const openNew = () => {
    const project = Storage.getToDoList().getProject(list);
    open({ isNew: true, task: {}, project });
  };

  return (
    <main className="editor">
      <div className="editor-header">
        <h3 id="list-name">{list}</h3>
      </div>
      <ul className="editor-list">
        {Storage.getToDoList()
          .filterProjects(list)
          .map((project) =>
            project.tasks.map((task) => (
              <li key={task.name}>
                <Task task={task} project={project} open={open} />
              </li>
            )),
          )}
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

  return (
    <div className="task" onClick={() => open({ isNew: false, task, project })}>
      <div
        className="checkbox"
        style={{ borderColor: project.color, background: bg }}
        onClick={completeTask}
      ></div>
      <p>{task.name}</p>
      <Icon path={mdiPlus} className="delete-task-btn icon" onClick={deleteTask} />
    </div>
  );
}
