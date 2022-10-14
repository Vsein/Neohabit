import plus from '../icons/plus.svg';

export default class Overlay {
  static create() {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    overlay.appendChild(Overlay.createTaskModal({ name: 'hello' }));

    overlay.addEventListener('click', Overlay.close);

    return overlay;
  }

  static close() {
    const overlay = document.querySelector('.overlay');
    overlay.classList.remove('overlay-active');

    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => modal.classList.remove('modal-active'));
  }

  static createTaskModal(task) {
    const taskModal = document.createElement('div');
    taskModal.classList.add('modal');
    taskModal.id = 'task-modal';

    const header = document.createElement('div');
    header.classList.add('modal-header');

    const title = document.createElement('h3');
    title.textContent = task.name;

    header.appendChild(title);
    header.appendChild(Overlay.createCloseModalButton());

    const description = document.createElement('p');
    if (task.desciprtion) {
      description.textContent = task.description;
    } else {
      description.textContent = 'Change description';
      description.style.color = 'grey';
    }

    taskModal.appendChild(header);
    taskModal.appendChild(description);

    return taskModal;
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

  static openTaskModal(task) {
    document.querySelector('#task-modal h3').textContent = task.name;
    document.querySelector('#task-modal p').textContent = task.description;

    document.querySelector('.overlay').classList.add('overlay-active');
    document.querySelector('#task-modal').classList.add('modal-active');
  }
}
