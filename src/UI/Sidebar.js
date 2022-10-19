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
          <div class="projects-header">
            <p>Projects</p>
            <img class="icon" src=${arrowDown}>
          </div>
        </div>
      </div>
    `;
  }

  static init() {
    Storage.getToDoList()
      .getFilters()
      .forEach((filter) => {
        const filterSections = document.querySelector('.filters');
        filterSections.appendChild(Sidebar.createFilterSection(filter));
      });

    Storage.getToDoList()
      .getProjects()
      .forEach((project) => {
        const projects = document.querySelector('.projects');
        projects.appendChild(Sidebar.createProjectTile(project));
      });
  }

  static createFilterSection(filter) {
    const filterSection = document.createElement('div');
    filterSection.classList.add('filter');
    if (filter.name === 'All') {
      filterSection.classList.add('active');
    }
    if (filter.name === 'Important') {
      filterSection.classList.add('important');
    }

    filterSection.innerHTML = `
      <img src=${filter.image} height="20px" width="20px">
      <p>${filter.name}<p>
    `;

    filterSection.addEventListener('click', () => {
      Editor.changeListTo(filter.name);
      Sidebar.resetActiveSection();

      filterSection.classList.add('active');
    });

    return filterSection;
  }

  static createProjectTile(project) {
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

    return projectTile;
  }

  static resetActiveSection() {
    const currentSection = document.querySelector('.sidebar .active');
    if (currentSection) {
      currentSection.classList.remove('active');
      currentSection.style.removeProperty('background-color');
    }
  }
}
