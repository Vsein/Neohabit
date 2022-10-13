export default class Task {
  constructor(name, description = '', dueDate = '') {
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.completed = false;
    // TODO: recurrent; checklists
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  complete() {
    this.completed = true;
  }

  uncomplete() {
    this.completed = false;
  }

  getDate() {
    return this.dueDate;
  }

  setDate(newDate) {
    this.dueDate = newDate;
  }
}
