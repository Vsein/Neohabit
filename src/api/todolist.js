import axios from 'axios';

const config = {
  params: {
    secret_token: localStorage.getItem('token')
  }
};

async function fetchProjects() {
  const res = await axios.get('http://localhost:9000/api/projects', config);
  return res.data;
}

async function fetchFilters() {
  const res = await axios.get('http://localhost:9000/api/filters', config);
  return res.data;
}

async function fetchTasks({ today, this_week, important, projectID }) {
  let url = 'http://localhost:9000/api/tasks?';
  if (projectID) url = `http://localhost:9000/api/project/${projectID}/tasks?`;
  if (today) url += 'today=true&';
  if (this_week) url += 'this_week=true&';
  if (important) url += 'important=true&';
  const res = await axios.get(url, config);
  return res.data;
}

async function fetchProjectByID(projectID) {
  const res = await axios.get(
    `http://localhost:9000/api/project/${projectID}/details`,
    config
  );
  return res.data;
}

async function fetchProject({ is_default }) {
  let url = 'http://localhost:9000/api/project?';
  if (is_default) url += 'default=true';
  const res = await axios.get(url, config);
  return res.data;
}

async function fetchTaskByID(taskID) {
  const res = await axios.get(`http://localhost:9000/api/task/${taskID}/details`, config);
  return res.data;
}

async function updateTask(id, formData) {
  const data = new URLSearchParams([...formData]);
  const res = await axios.post(`http://localhost:9000/api/task/${id}/update`, data, config);
}

async function createTask(formData) {
  const data = new URLSearchParams([...formData]);
  const res = await axios.post('http://localhost:9000/api/task/create', data, config);
}

async function deleteTask(id) {
  const res = await axios.delete(`http://localhost:9000/api/task/${id}/delete`, config);
  return res;
}

export {
  fetchProjects,
  fetchFilters,
  fetchTasks,
  fetchProjectByID,
  fetchProject,
  fetchTaskByID,
  updateTask,
  createTask,
  deleteTask,
};
