import plus from '../icons/plus.svg';
import bin from '../icons/trash-can-outline.svg';
import Project from '../modules/Project';
import Task from '../modules/Task';

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

    const taskDetails = document.createElement('div');
    taskDetails.classList.add('modal-details');

    const title = document.createElement('h3');
    title.textContent = task.name;

    taskDetails.appendChild(title);
    // header.appendChild(Overlay.createDeleteTaskButton());
    header.appendChild(Overlay.createCloseModalButton());

    const description = document.createElement('p');
    description.classList.add('modal-description');
    if (task.desciprtion) {
      description.textContent = task.description;
    } else {
      description.textContent = 'Change description';
    }
    taskDetails.appendChild(description);

    taskModal.appendChild(header);
    taskModal.appendChild(taskDetails);

    return taskModal;
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
    document.querySelector('.modal-description').textContent = task.name;

    document.querySelector('.overlay').classList.add('overlay-active');
    document.querySelector('.modal').classList.add('modal-active');
  }
}
