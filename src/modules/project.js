import { toDate, isToday, isThisWeek } from 'date-fns';

export default class Project {
  constructor(name, description, dueDate, color) {
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.color = color;
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

  getTasksToday() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.getDateFormatted());
      return isToday(toDate(taskDate));
    });
  }

  getTasksThisWeek() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.getDate());
      return isThisWeek(toDate(taskDate), 1);
    });
  }
}
