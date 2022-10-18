export default class Task {
  constructor(
    name = '',
    description = '',
    dueDate = '',
    completed = false,
    important = false,
  ) {
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.completed = completed;
    this.important = important;
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
