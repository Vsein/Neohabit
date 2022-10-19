import plus from '../icons/plus.svg';
// import bin from '../icons/trash-can-outline.svg';
import Project from '../modules/Project';
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
            <div class="close-modal-button icon">
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

  static openTaskModal(isNew, project, task) {
    const submitType = document.querySelector('#submit-form-button');
    const projectName = document.querySelector('.modal .tag p');
    if (isNew) {
      submitType.textContent = 'Add task';
    } else {
      submitType.textContent = 'Save';
    }
    const circle = document.querySelector('.modal .tag .centering div');
    const listName = document.getElementById('list-name').textContent;
    if (!Storage.getToDoList().isFilter(listName)) {
      const listProject = Storage.getToDoList().getProject(listName);
      projectName.textContent = listProject.name;
      circle.style.backgroundColor = listProject.color;
    } else {
      projectName.textContent = project.name;
      circle.style.backgroundColor = project.color;
    }

    document.querySelector('.form-task-name').value = task.name;
    document.querySelector('.form-task-description').value = task.description;
    document.querySelector('.form-task-name').textContent = task.name;
    document.querySelector('.form-task-description').textContent = task.description;

    document.querySelector('.overlay').classList.add('overlay-active');
    document.querySelector('.modal').classList.add('modal-active');
  }
}
