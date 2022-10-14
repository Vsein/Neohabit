import Project from './Project';
import Task from './Task';
import ToDoList from './ToDoList';

export default class Storage {
  static saveToDoList(data) {
    localStorage.setItem('toDoList', JSON.stringify(data));
  }

  static getToDoList() {
    const toDoList = Object.assign(
      new ToDoList(),
      JSON.parse(localStorage.getItem('toDoList')),
    );

    toDoList.setProjects(
      toDoList
        .getProjects()
        .map((project) => Object.assign(new Project(), project)),
    );

    toDoList
      .getProjects()
      .forEach((project) => project.setTasks(
        project.getTasks().map((task) => Object.assign(new Task(), task)),
      ));

    return toDoList;
  }

  static completeTask(projectName, taskName) {
    const toDoList = Storage.getToDoList();
    toDoList.getProject(projectName).getTask(taskName).toggleComplete();
    Storage.saveToDoList(toDoList);
  }

  static deleteTask(projectName, taskName) {
    const toDoList = Storage.getToDoList();
    toDoList.getProject(projectName).deleteTask(taskName);
    Storage.saveToDoList(toDoList);
  }
}
