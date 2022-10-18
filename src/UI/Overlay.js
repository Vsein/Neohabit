import plus from '../icons/plus.svg';
// import bin from '../icons/trash-can-outline.svg';
import Project from '../modules/Project';
import Task from '../modules/Task';
import Storage from '../modules/Storage';

export default class Overlay {
  static create() {
    const content = document.getElementById('content');
    const project = new Project();
    content.innerHTML += `
      <div class="overlay">
        <div class="modal">
          <div class="modal-header">
            <div class="tag">
              <div class="centering">
                <div class="project-circle" style="
                  background-color:${project.color}">
                </div>
              </div>
              <p class="${project.name === 'Neohabit' ? project.name : ''}">
              ${project.name}</p>
            </div>
            <div id="close-modal-button">
              <img src=${plus}>
            </div>
          </div>
          <div class="modal-details">
            <div>
              <label for="task-name"></label>
              <textarea
                class="form-task-name"
                name="task-name"
                rows="1"
                placeholder="Change task name"
              ></textarea>
            </div>
            <div>
              <label for="task-description"></label>
              <textarea
                class="form-task-description"
                name="task-description"
                rows="1"
                placeholder="Change description"
              ></textarea>
            </div>
          </div>
          <div class="modal-buttons">
            <button class="form-button" id="cancel-form-button">Cancel</button>
            <button class="form-button" id="submit-form-button">Save</button>
          </div>
        </div>
      </div>
    `;
  }

  static init() {
    document.querySelector('.overlay').addEventListener('click', Overlay.close);
    document
      .querySelector('.modal')
      .addEventListener('click', (e) => e.stopPropagation());
    document
      .getElementById('cancel-form-button')
      .addEventListener('click', Overlay.close);
    document
      .getElementById('submit-form-button')
      .addEventListener('click', Overlay.submitTask);
    document
      .getElementById('close-modal-button')
      .addEventListener('click', Overlay.close);
  }

  static close() {
    const overlay = document.querySelector('.overlay');
    overlay.classList.remove('overlay-active');

    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => modal.classList.remove('modal-active'));
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
    if (document.querySelector('#submit-form-button').textContent === 'Save') {
      Storage.changeTask(projectName, taskName, task);
    } else {
      Storage.addTask(projectName, task);
    }
    Overlay.close();
  }

  static openTaskModal(isNew, project, task) {
    if (isNew) {
      document.querySelector('#submit-form-button').textContent = 'Add task';
    } else {
      document.querySelector('#submit-form-button').textContent = 'Save';
    }
    document.querySelector('.modal .tag p').textContent = project.name;
    document.querySelector('.modal .tag .centering div').style.backgroundColor = project.color;
    document.querySelector('.form-task-name').value = task.name;
    document.querySelector('.form-task-description').value = task.description;

    document.querySelector('.overlay').classList.add('overlay-active');
    document.querySelector('.modal').classList.add('modal-active');
  }
}
