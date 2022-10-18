import '../styles/UI.css';
import Storage from '../modules/Storage';
import MainMenu from './MainMenu';
import Sidebar from './Sidebar';
import Editor from './Editor';
import Overlay from './Overlay';
import Task from '../modules/Task';
import { endOfToday, endOfWeek } from 'date-fns';

export default class UI {
  static load() {
    const content = document.createElement('div');
    content.id = 'content';
    document.body.appendChild(content);

    MainMenu.create();
    Sidebar.create();
    Editor.create();
    Overlay.create();

    Sidebar.init();
    Editor.changeListTo('All');
    UI.initModal();
  }

  static closeModal() {
    const overlay = document.querySelector('.overlay');
    overlay.classList.remove('overlay-active');

    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => modal.classList.remove('modal-active'));

    const listName = document.getElementById('list-name');
    Editor.changeListTo(listName.textContent);
  }

  static initModal() {
    document.querySelector('.overlay').addEventListener('click', UI.closeModal);
    document
      .querySelector('.modal')
      .addEventListener('click', (e) => e.stopPropagation());
    document
      .getElementById('cancel-form-button')
      .addEventListener('click', UI.closeModal);
    document
      .getElementById('submit-form-button')
      .addEventListener('click', UI.submitTask);
    document
      .getElementById('close-modal-button')
      .addEventListener('click', UI.closeModal);
  }

  static getTask() {
    const title = document.querySelector('.form-task-name').value;
    const description = document.querySelector('.form-task-description').value;
    const listName = document.querySelector('#list-name').textContent;
    if (Storage.getToDoList().isFilter(listName)) {
      if (listName === 'Today') {
        return new Task(title, description, endOfToday());
      }
      if (listName === 'This Week') {
        return new Task(title, description, endOfWeek(endOfToday(), { weekStartsOn: 1 }));
      }
      if (listName === 'Important') {
        return new Task(title, description, '', false, true);
      }
    }
    return new Task(title, description);
  }

  static submitTask(e) {
    e.preventDefault();
    const projectName = document.querySelector('.modal .tag p').textContent;
    const taskName = document.querySelector('.form-task-name').textContent;
    const task = UI.getTask();
    if (document.querySelector('#submit-form-button').textContent === 'Save') {
      Storage.changeTask(projectName, taskName, task);
    } else {
      Storage.addTask(projectName, task);
    }
    UI.closeModal();
  }
}
