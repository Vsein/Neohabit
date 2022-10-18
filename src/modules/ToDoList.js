import Project from './Project';
import Task from './Task';
import Filter from './Filter';

export default class ToDoList {
  constructor() {
    this.projects = [
      new Project(),
      new Project('Neohabit', '#144e12', [
        new Task('Get ahead', '', '2022-10-14', true),
        new Task('Get further ahead', '', '2022-10-16', false, true),
        new Task('Get even further beyond', ''),
      ]),
      new Project('Cooking', '#edad0e', [
        new Task('Don\'t die of starvation'),
      ]),
      new Project('Languages', '#00ed76', [
        new Task('Study Japanese for 30 mineutes'),
      ]),
    ];
    this.filters = [
      new Filter('All'),
      new Filter('Today'),
      new Filter('This Week'),
      new Filter('Important'),
    ];
  }

  setProjects(projects) {
    this.projects = projects;
  }

  getProjects() {
    return this.projects;
  }

  getFilters() {
    return this.filters;
  }

  getProject(projectName) {
    return this.projects.find((project) => project.getName() === projectName);
  }

  contains(projectName) {
    return this.projects.some((project) => project.getName() === projectName);
  }

  addProject(project) {
    if (this.contains(project.name)) return;
    this.projects.push(project);
  }

  deleteProject(projectName) {
    const projectToDelete = this.projects.find(
      (project) => project.getName() === projectName,
    );
    this.projects.splice(this.projects.indexOf(projectToDelete), 1);
  }

  filterProjects(filter) {
    if (filter === 'All') {
      return this.projects;
    }
    if (filter === 'Today') {
      const todayProjects = this.projects.filter((project) => project.hasTasksToday());

      todayProjects.forEach((project) => {
        project.setTasks(project.getTasksToday());
      });

      return todayProjects;
    }
    if (filter === 'This Week') {
      const thisWeekProjects = this.projects.filter((project) => project.hasTasksThisWeek());

      thisWeekProjects.forEach((project) => {
        project.setTasks(project.getTasksThisWeek());
      });

      return thisWeekProjects;
    }
    if (filter === 'Important') {
      const importantProjects = this.projects.filter((project) => project.hasImportantTasks());
      importantProjects.forEach((project) => {
        project.setTasks(project.getImportantTasks());
      });

      return importantProjects;
    }
    return [this.getProject(filter)];
  }
}
