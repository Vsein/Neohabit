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

async function fetchTasks({ today, this_week, important, id }) {
  let url = 'http://localhost:9000/api/tasks?';
  if (id) url = `http://localhost:9000/api/project/${id}/tasks?`;
  if (today) url += 'today=true&';
  if (this_week) url += 'this_week=true&';
  if (important) url += 'important=true&';
  const res = await fetch(url);
  const textRes = await res.text();
  const tasks = JSON.parse(textRes);

  return tasks;
}

export {
  fetchProjects,
  fetchFilters,
  fetchTasks,
};
