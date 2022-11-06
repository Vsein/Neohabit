async function deleteTask(id) {
  const res = await fetch(`http://localhost:9000/api/task/${id}`, { method: 'DELETE' });

  return res;
}

export { deleteTask };
