import plus from '../icons/plus.svg';
import bin from '../icons/trash-can-outline.svg';
import Project from '../modules/Project';
import Task from '../modules/Task';
import Storage from '../modules/Storage';

export default class Overlay {
  static create() {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    overlay.appendChild(Overlay.createTaskModal());

    overlay.addEventListener('click', Overlay.close);

    return overlay;
  }

  static close() {
    const overlay = document.querySelector('.overlay');
    overlay.classList.remove('overlay-active');

    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => modal.classList.remove('modal-active'));
  }

  static createTaskModal(task = new Task()) {
    const taskModal = document.createElement('div');
    taskModal.classList.add('modal');

    const header = document.createElement('div');
    header.classList.add('modal-header');
    header.appendChild(Overlay.createProjectTile());
    header.appendChild(Overlay.createCloseModalButton());
    // header.appendChild(Overlay.createDeleteTaskButton());

    const taskDetails = document.createElement('div');
    taskDetails.classList.add('modal-details');
    taskDetails.appendChild(Overlay.createTaskNameForm(task));
    taskDetails.appendChild(Overlay.createTaskDescriptionForm(task));

    const buttons = document.createElement('div');
    buttons.classList.add('modal-buttons');
    buttons.appendChild(Overlay.createCancelFormButton(task));
    buttons.appendChild(Overlay.createSaveFormButton(task));

    taskModal.appendChild(header);
    taskModal.appendChild(taskDetails);
    taskModal.appendChild(buttons);
    taskModal.addEventListener('click', (e) => e.stopPropagation());

    return taskModal;
  }

  static createTaskNameForm(task) {
    const container = document.createElement('div');

    const label = document.createElement('label');
    label.setAttribute('for', 'task-name');

    const area = document.createElement('textarea');
    area.classList.add('form-task-name');
    area.rows = 1;
    area.name = 'task-name';
    area.textContent = task.name;
    area.placeholder = 'Change task name';

    container.appendChild(label);
    container.appendChild(area);

    return container;
  }

  static createTaskDescriptionForm(task) {
    const container = document.createElement('div');

    const label = document.createElement('label');
    label.setAttribute('for', 'task-description');

    const description = document.createElement('textarea');
    description.classList.add('form-task-description');
    description.placeholder = 'Change description';
    description.textContent = task.description;

    container.appendChild(label);
    container.appendChild(description);

    return container;
  }

  static createCancelFormButton() {
    const button = document.createElement('button');
    button.classList.add('form-button');
    button.id = 'cancel-form-button';
    button.textContent = 'Cancel';

    button.addEventListener('click', Overlay.close);

    return button;
  }

  static getTask() {
    const title = document.querySelector('.form-task-name').value;
    const description = document.querySelector('.form-task-description').value;
    return new Task(title, description);
  }

  static submitTask(e) {
    e.preventDefault();
    const projectName = document.querySelector('.modal .tag p').textContent;
    const taskName = document.querySelector('.form-task-name').textContent;
    const task = Overlay.getTask();
    Storage.changeTask(projectName, taskName, task);
    Overlay.close();
  }

  static createSaveFormButton() {
    const button = document.createElement('button');
    button.classList.add('form-button');
    button.id = 'save-form-button';
    button.textContent = 'Save';

    button.addEventListener('click', Overlay.submitTask);

    return button;
  }

  static createProjectTile(project = new Project()) {
    const projectTile = document.createElement('div');
    projectTile.classList.add('tag');

    const text = document.createElement('p');
    if (project.name === 'Neohabit') {
      text.classList.add('neohabit');
    } else {
      text.textContent = project.name;
    }
    text.height = '12px';

    const wrapper = document.createElement('div');
    wrapper.classList.add('centering');
    wrapper.style.height = '20px';
    wrapper.style.width = '20px';

    const icon = document.createElement('div');
    icon.style.backgroundColor = project.color;
    icon.style.height = '12px';
    icon.style.width = '12px';
    icon.style.borderRadius = '50%';

    wrapper.appendChild(icon);

    projectTile.appendChild(wrapper);
    projectTile.appendChild(text);

    return projectTile;
  }

  static createDeleteTaskButton() {
    const btn = document.createElement('div');
    btn.classList.add('icon');

    const icon = document.createElement('img');
    icon.src = bin;

    btn.appendChild(icon);

    btn.addEventListener('click', Overlay.close);

    return btn;
  }

  static createCloseModalButton() {
    const btn = document.createElement('div');
    btn.classList.add('close-task-btn');

    const icon = document.createElement('img');
    icon.src = plus;

    btn.appendChild(icon);

    btn.addEventListener('click', Overlay.close);

    return btn;
  }

  static openTaskModal(project, task) {
    document.querySelector('.modal .tag p').textContent = project.name;
    document.querySelector(
      '.modal .tag .centering div',
    ).style.backgroundColor = project.color;
    document.querySelector('.form-task-name').textContent = task.name;

    document.querySelector('.overlay').classList.add('overlay-active');
    document.querySelector('.modal').classList.add('modal-active');
  }
}
