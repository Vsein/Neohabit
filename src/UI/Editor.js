import React, { useState } from 'react';
import plus from '../icons/plus.svg';
import Storage from '../modules/Storage';

export default function Editor(props) {
  const { list } = props;

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
              <Task task={task} project={project} key={task.name} />
            ))
          )}
      </div>
      <button className="add-task-btn">
        <img className="add-task-icon" src={plus} />
        <p>Add task</p>
      </button>
    </div>
  );
}

function Task(props) {
  const { task, project } = props;
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
    <div className="task">
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
