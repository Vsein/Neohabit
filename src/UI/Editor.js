import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import plus from '../icons/plus.svg';
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
    <div className="editor">
      <div className="editor-header">
        <h3 id="list-name">{list}</h3>
      </div>
      <div className="editor-list">
        {Storage.getToDoList()
          .filterProjects(list)
          .map((project) =>
            project.tasks.map((task) => (
              <Task task={task} project={project} key={task.name} open={open} />
            )),
          )}
        <button className="add-task-btn" onClick={openNew}>
          <img className="add-task-icon" src={plus} />
          <p>Add task</p>
        </button>
      </div>
    </div>
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
      <img src={plus} className="delete-task-btn icon" onClick={deleteTask} />
    </div>
  );
}
