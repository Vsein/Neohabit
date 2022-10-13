import Project from './Project';
import Task from './Task';
import Filter from './Filter';

export default class ToDoList {
  constructor() {
    // this.projects = [new Project('Default')];
    // dummy projects for the time being
    this.projects = [
      new Project('Neohabit', '#144e12', [
        new Task('Get ahead', '', '2022-10-14'),
        new Task('Get further ahead', ''),
        new Task('Get even further beyond', ''),
      ]),
      new Project('Cooking', '#edad0e'),
      new Project('Languages', '#00ed76'),
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
    if (filter === 'Today') {
      const todayProjects = this.projects.filter((project) => project.hasTasksToday());

      todayProjects.forEach((project) => {
        project.setTasks(project.getTasksToday());
      });

      return todayProjects;
    }
    if (filter === 'This Week') {
      return this.projects
        .filter((project) => !project.getTasksThisWeek())
        .map((project) => project.getTasksThisWeek());
    }
    return [];
  }
}
