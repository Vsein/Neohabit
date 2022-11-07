async function fetchProjects() {
  const res = await fetch('http://localhost:9000/api/projects');
  const textRes = await res.text();
  const projects = JSON.parse(textRes);

  return projects;
}

async function fetchFilters() {
  const res = await fetch('http://localhost:9000/api/filters');
  const textRes = await res.text();
  const filters = JSON.parse(textRes);

  return filters;
}

async function fetchTasks({ today, this_week, important, projectID }) {
  let url = 'http://localhost:9000/api/tasks?';
  if (projectID) url = `http://localhost:9000/api/project/${projectID}/tasks?`;
  if (today) url += 'today=true&';
  if (this_week) url += 'this_week=true&';
  if (important) url += 'important=true&';
  const res = await fetch(url);
  const textRes = await res.text();
  const tasks = JSON.parse(textRes);

  return tasks;
}

async function fetchProjectByID(projectID) {
  const res = await fetch(`http://localhost:9000/api/project/${projectID}/details`);
  const textRes = await res.text();
  const project = JSON.parse(textRes);

  return project;
}

async function fetchProject({ is_default }) {
  let url = 'http://localhost:9000/api/project?';
  if (is_default) url += 'default=true';
  const res = await fetch(url);
  const textRes = await res.text();
  const project = JSON.parse(textRes);

  return project;
}

async function fetchTaskByID(taskID) {
  const res = await fetch(`http://localhost:9000/api/task/${taskID}/details`);
  const textRes = await res.text();
  const task = JSON.parse(textRes);

  return task;
}

export {
  fetchProjects,
  fetchFilters,
  fetchTasks,
  fetchProjectByID,
  fetchProject,
  fetchTaskByID,
};
