async function updateTask(id, formData) {
  const data = new URLSearchParams([...formData.entries()]);
  const res = await fetch(`http://localhost:9000/api/task/${id}/update`, { method: 'POST', body: data });
}

async function createTask(formData) {
  const data = new URLSearchParams([...formData.entries()]);
  const res = await fetch('http://localhost:9000/api/task/create', { method: 'POST', body: data });
}

export { updateTask, createTask };
