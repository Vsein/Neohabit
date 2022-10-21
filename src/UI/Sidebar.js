import arrowDown from '../icons/chevron-down.svg';
import Storage from '../modules/Storage';
import Editor from './Editor';

export default class Sidebar {
  static create() {
    const content = document.getElementById('content');
    content.innerHTML += `
      <div class="sidebar">
        <div class="filters">
        </div>
        <div class="projects">
          <input type="checkbox" class="projects-checkbox" id="projects-checkbox">
          <label class="projects-header" for="projects-checkbox">
            <p>Projects</p>
            <img class="icon projects-arrow" src=${arrowDown}>
          </label>
          <div class="projects-container"></div>
        </div>
      </div>
    `;
    content.innerHTML += `
      <div class="sidebar-mobile">
        <div class="filters-mobile">
        </div>
        <div class="projects-mobile">
        </div>
      </div>
    `;
  }

  static init() {
    Storage.getToDoList()
      .getFilters()
      .forEach((filter) => {
        Sidebar.createFilterSection(filter);
      });

    Storage.getToDoList()
      .getProjects()
      .forEach((project) => {
        Sidebar.createProjectTile(project);
      });
  }

  static createFilterSection(filter) {
    const filters = document.querySelector('.filters');
    const filterSection = document.createElement('div');
    const filtersMobile = document.querySelector('.filters-mobile');
    const filterSectionMobile = document.createElement('img');

    filterSection.classList.add('filter');
    filterSectionMobile.classList.add('filter-mobile');
    if (filter.name === 'All') {
      filterSection.classList.add('active');
      filterSectionMobile.classList.add('active');
    }
    if (filter.name === 'Important') {
      filterSection.classList.add('important');
      filterSectionMobile.classList.add('important');
    }

    filterSection.innerHTML = `
      <img src=${filter.image} height="20px" width="20px">
      <p>${filter.name}<p>
    `;
    filterSectionMobile.src = filter.image;

    filterSection.addEventListener('click', () => {
      Editor.changeListTo(filter.name);
      Sidebar.resetActiveSection();

      filterSection.classList.add('active');
      filterSectionMobile.classList.add('active');
    });

    filterSectionMobile.addEventListener('click', () => {
      Editor.changeListTo(filter.name);
      Sidebar.resetActiveSection();

      filterSection.classList.add('active');
      filterSectionMobile.classList.add('active');
    });

    filters.appendChild(filterSection);
    filtersMobile.appendChild(filterSectionMobile);
  }

  static createProjectTile(project) {
    const projects = document.querySelector('.projects-container');
    const projectTile = document.createElement('div');
    projectTile.classList.add('project');
    projectTile.innerHTML += `
      <div class="centering">
        <div class="project-circle" style="background-color:${project.color}">
        </div>
      </div>
      <p class="${project.name === 'Neohabit' ? project.name : ''}">
      ${project.name}</p>
    `;

    projectTile.addEventListener('click', () => {
      Editor.changeListTo(project.name);
      Sidebar.resetActiveSection();

      projectTile.classList.add('active');
      projectTile.style.backgroundColor = `${project.color}33`;
    });

    projects.appendChild(projectTile);
  }

  static resetActiveSection() {
    const currentSection = document.querySelector('.sidebar .active');
    const currentSectionMobile = document.querySelector('.sidebar-mobile .active');
    if (currentSection) {
      currentSection.classList.remove('active');
    }
    if (currentSectionMobile) {
      currentSectionMobile.classList.remove('active');
    }
  }
}
