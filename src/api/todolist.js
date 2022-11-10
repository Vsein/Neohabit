import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:9000/api/',
  params: {
    secret_token: localStorage.getItem('token'),
  },
});

async function fetchProjects() {
  const res = await apiClient.get('projects');
  return res.data;
}

async function fetchFilters() {
  const res = await apiClient.get('filters');
  return res.data;
}

async function fetchTasks({ today, this_week, important, projectID }) {
  const res = await apiClient.get('tasks', {
    params: {
      projectID,
      today,
      this_week,
      important,
    },
  });
  return res.data;
}

async function fetchProjectByID(projectID) {
  const res = await apiClient.get(`project/${projectID}/details`);
  return res.data;
}

async function fetchProject({ is_default }) {
  const res = await apiClient.get('project', {
    params: {
      is_default,
    },
  });
  return res.data;
}

async function fetchTaskByID(taskID) {
  const res = await apiClient.get(`task/${taskID}/details`);
  return res.data;
}

async function updateTask(id, formData) {
  const data = new URLSearchParams([...formData]);
  const res = await apiClient.post(`task/${id}/update`, data);
}

async function createTask(formData) {
  const data = new URLSearchParams([...formData]);
  const res = await apiClient.post('task/create', data);
}

async function deleteTask(id) {
  const res = await apiClient.delete(`task/${id}/delete`);
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
