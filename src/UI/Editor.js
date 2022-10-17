import plus from '../icons/plus.svg';
import Storage from '../modules/Storage';
import Overlay from './Overlay';
import Project from '../modules/Project';
import Task from '../modules/Task';

export default class Editor {
  static create() {
    const editor = document.createElement('div');
    editor.id = 'editor';

    editor.appendChild(Editor.createHeader());
    editor.appendChild(Editor.createList());

    return editor;
  }

  static createHeader() {
    const header = document.createElement('div');
    header.classList.add('editor-header');

    const sectionName = document.createElement('h3');
    sectionName.textContent = 'Today';

    header.appendChild(sectionName);

    return header;
  }

  static changeHeader(newName) {
    const headerText = document.querySelector('.editor-header > h3');
    headerText.textContent = newName;
  }

  static createList() {
    const list = document.createElement('div');
    list.classList.add('editor-list');

    Storage.getToDoList()
      .filterProjects('Today')
      .forEach((project) => {
        project.tasks.forEach((task) => {
          list.appendChild(Editor.createTask(project, task));
        });
      });

    list.appendChild(Editor.createAddTaskButton());

    return list;
  }

  static changeListFilterTo(filterName) {
    const list = document.querySelector('.editor-list');

    Editor.clearList();
    Editor.changeHeader(filterName);

    Storage.getToDoList()
      .filterProjects(filterName)
      .forEach((project) => {
        project.tasks.forEach((task) => {
          list.appendChild(Editor.createTask(project, task));
        });
      });

    list.appendChild(Editor.createAddTaskButton());
  }

  static changeListProjectTo(projectName) {
    const list = document.querySelector('.editor-list');

    Editor.clearList();
    Editor.changeHeader(projectName);

    const project = Storage.getToDoList().getProject(projectName);
    project.getTasks().forEach((task) => {
      list.appendChild(Editor.createTask(project, task));
    });

    list.appendChild(Editor.createAddTaskButton());
  }

  static clearList() {
    const list = document.querySelector('.editor-list');
    list.innerHTML = '';
  }

  static createTask(project, task) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');

    taskDiv.appendChild(Editor.createCheckbox(project, task));

    const text = document.createElement('p');
    text.textContent = task.name;
    taskDiv.appendChild(text);

    taskDiv.appendChild(Editor.createDeleteTaskButton(project, task));

    taskDiv.addEventListener('click', () => Overlay.openTaskModal(false, project, task));

    return taskDiv;
  }

  static createCheckbox(project, task) {
    const checkbox = document.createElement('div');
    checkbox.classList.add('checkbox');
    checkbox.style.borderColor = project.color;

    const checkFill = () => {
      if (task.completed) {
        checkbox.style.background = `radial-gradient(${project.color} 30%, ${project.color}33 40%)`;
      } else {
        checkbox.style.background = `${project.color}33`;
      }
    };

    checkFill();

    checkbox.addEventListener('click', (e) => {
      e.stopPropagation();
      Storage.completeTask(project.name, task.name);
      task.toggleComplete();
      checkFill();
    });

    return checkbox;
  }

  static createDeleteTaskButton(project, task) {
    const btn = document.createElement('div');
    btn.classList.add('delete-task-btn');

    const icon = document.createElement('img');
    icon.src = plus;

    btn.appendChild(icon);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      Storage.deleteTask(project.name, task.name);
      btn.parentElement.remove();
    });

    return btn;
  }

  static createAddTaskButton() {
    const btn = document.createElement('button');
    btn.classList.add('new-task-btn');

    const img = document.createElement('img');
    img.classList.add('new-task-icon');
    img.src = plus;

    const text = document.createElement('text');
    text.textContent = 'Add task';

    btn.appendChild(img);
    btn.appendChild(text);

    btn.addEventListener('click', () => Overlay.openTaskModal(false, new Project(), new Task()));

    return btn;
  }
}
