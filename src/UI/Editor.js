import plus from '../icons/plus.svg';
import Storage from '../modules/Storage';
import Overlay from './Overlay';
import Project from '../modules/Project';
import Task from '../modules/Task';

export default class Editor {
  static create() {
    const content = document.getElementById('content');
    content.innerHTML += `
      <div class="editor">
        <div class="editor-header">
          <h3 id="list-name">Today</h3>
        </div>
        <div class="editor-list">
        </div>
        <button class="add-task-btn">
          <img class="add-task-icon" src=${plus}>
          <p>Add task</p>
        </button>
      </div>
    `;
  }

  static changeListTo(newListName) {
    const listName = document.getElementById('list-name');
    listName.textContent = newListName;

    const list = document.querySelector('.editor-list');
    list.innerHTML = '';

    Storage.getToDoList()
      .filterProjects(listName.textContent)
      .forEach((project) => {
        project.tasks.forEach((task) => {
          Editor.createTask(project, task);
        });
      });

    const addTaskBtn = document.querySelector('.add-task-btn');
    addTaskBtn.addEventListener('click', () => {
      Overlay.openTaskModal(true, new Project(), new Task());
    });
  }

  static createTask(project, task) {
    const list = document.querySelector('.editor-list');

    const taskTile = document.createElement('div');
    taskTile.classList.add('task');
    taskTile.innerHTML = `
      <div class="checkbox" style="border-color:${project.color};background:${Editor.getBG(task.completed, project.color)}"></div>
      <p>${task.name}</p>
      <img src=${plus} class="delete-task-btn icon">
    `;
    list.appendChild(taskTile);

    taskTile.addEventListener('click', () => Overlay.openTaskModal(false, project, task));
    taskTile.querySelector('.checkbox').addEventListener('click', (e) => {
      e.stopPropagation();
      Storage.completeTask(project.name, task.name);
      task.toggleComplete();
      e.target.style.background = Editor.getBG(task.completed, project.color);
    });
    taskTile
      .querySelector('.delete-task-btn')
      .addEventListener('click', (e) => {
        e.stopPropagation();
        Storage.deleteTask(project.name, task.name);
        e.target.parentElement.remove();
      });
  }

  static getBG(completed, color) {
    if (completed) {
      return `radial-gradient(${color} 30%, ${color}33 40%)`;
    }
    return `${color}33`;
  }
}
