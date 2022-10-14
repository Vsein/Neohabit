import plus from '../icons/plus.svg';
import Storage from '../modules/Storage';

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

    Storage.getToDoList().filterProjects('Today').forEach((project) => {
      project.tasks.forEach((task) => {
        list.appendChild(Editor.createTask(task, project.color));
      });
    });

    list.appendChild(Editor.createAddTaskButton());

    return list;
  }

  static changeListFilterTo(filterName) {
    const list = document.querySelector('.editor-list');

    Editor.clearList();
    Editor.changeHeader(filterName);

    Storage.getToDoList().filterProjects(filterName).forEach((project) => {
      project.tasks.forEach((task) => {
        list.appendChild(Editor.createTask(task, project.color));
      });
    });

    list.appendChild(Editor.createAddTaskButton());
  }

  static clearList() {
    const list = document.querySelector('.editor-list');
    list.innerHTML = '';
  }

  static createTask(task, color) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');

    taskDiv.appendChild(Editor.createCheckbox(color));

    const text = document.createElement('p');
    text.textContent = task.name;

    taskDiv.appendChild(text);

    return taskDiv;
  }

  static createCheckbox(color) {
    const checkbox = document.createElement('div');
    checkbox.classList.add('checkbox');
    checkbox.style.borderColor = color;

    return checkbox;
  }

  static createAddTaskButton() {
    const btn = document.createElement('button');
    btn.classList.add('new-task-btn');

    const img = document.createElement('img');
    img.style.height = '30px';
    img.style.width = '30px';
    img.src = plus;

    const text = document.createElement('text');
    text.textContent = 'Add task';

    btn.appendChild(img);
    btn.appendChild(text);

    return btn;
  }
}
