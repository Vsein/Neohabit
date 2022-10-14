import arrowDown from '../icons/chevron-down.svg';
import Storage from '../modules/Storage';
import Editor from './Editor';

export default class Sidebar {
  static create() {
    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar');

    sidebar.appendChild(Sidebar.createFilterSections());
    sidebar.appendChild(Sidebar.createProjectsNav());

    return sidebar;
  }

  static createFilterSections() {
    const filterSections = document.createElement('div');
    filterSections.classList.add('task-sections');

    Storage.getToDoList()
      .getFilters()
      .forEach((filter) => {
        const section = Sidebar.createFilterSection(filter);

        filterSections.appendChild(section);

        section.addEventListener('click', () => {
          Editor.changeListFilterTo(filter.name);

          const currentSection = document.querySelector('.task-section.active');
          if (currentSection) {
            currentSection.classList.remove('active');
          }

          section.classList.add('active');
        });
      });

    return filterSections;
  }

  static createFilterSection(filter) {
    const filterSection = document.createElement('div');
    filterSection.classList.add('task-section');
    if (filter.name === 'Today') {
      filterSection.classList.add('active');
    }

    const icon = document.createElement('img');
    icon.style.height = '20px';
    icon.style.width = '20px';
    icon.src = filter.image;

    const p = document.createElement('p');
    p.textContent = filter.name;

    filterSection.appendChild(icon);
    filterSection.appendChild(p);

    return filterSection;
  }

  static createProjectsNav() {
    const projects = document.createElement('div');
    projects.classList.add('projects');

    projects.appendChild(Sidebar.createProjectHeader());

    Storage.getToDoList()
      .getProjects()
      .forEach((project) => {
        projects.appendChild(Sidebar.createProjectTile(project));
      });

    return projects;
  }

  static createProjectHeader() {
    const header = document.createElement('div');
    header.classList.add('projects-header');

    const text = document.createElement('p');
    text.textContent = 'Projects';

    const icon = document.createElement('img');
    icon.classList.add('icon');
    icon.src = arrowDown;

    header.appendChild(text);
    header.appendChild(icon);

    return header;
  }

  static createProjectTile(project) {
    const projectTile = document.createElement('div');
    projectTile.classList.add('project');

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
}
