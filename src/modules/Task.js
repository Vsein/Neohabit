export default class Task {
  constructor(name = '', description = '', dueDate = '', completed = false) {
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.completed = completed;
    // TODO: recurrent; checklists
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  getDate() {
    return this.dueDate;
  }

  setDate(newDate) {
    this.dueDate = newDate;
  }
}
