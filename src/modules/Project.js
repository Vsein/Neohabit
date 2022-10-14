import { toDate, isToday, isThisWeek } from 'date-fns';

export default class Project {
  constructor(
    name = 'Default',
    color = '#8A8A8A',
    tasks = [],
    dueDate = '',
    description = '',
  ) {
    this.name = name;
    this.color = color;
    this.tasks = tasks;
    this.dueDate = dueDate;
    this.description = description;
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  getTasks() {
    return this.tasks;
  }

  setTasks(tasks) {
    this.tasks = tasks;
  }

  setColor(color) {
    this.color = color;
  }

  getColor() {
    return this.color;
  }

  contains(taskName) {
    return this.tasks.some((task) => task.getName === taskName);
  }

  addTask(newTask) {
    if (this.contains(newTask.name)) return;
    this.tasks.push(newTask);
  }

  deleteTask(taskName) {
    this.tasks = this.tasks.filter((task) => task.name !== taskName);
  }

  hasTasksToday() {
    return this.tasks.some((task) => {
      const taskDate = new Date(task.getDate());
      return isToday(toDate(taskDate));
    });
  }

  getTasksToday() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.getDate());
      return isToday(toDate(taskDate));
    });
  }

  hasTasksThisWeek() {
    return this.tasks.some((task) => {
      const taskDate = new Date(task.getDate());
      return isThisWeek(toDate(taskDate), { weekStartsOn: 1 });
    });
  }

  getTasksThisWeek() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.getDate());
      return isThisWeek(toDate(taskDate), { weekStartsOn: 1 });
    });
  }
}
