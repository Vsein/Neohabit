import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Editor from './Editor';
import Overlay from './Overlay';
import Navigation from './Navigation';
import { fetchProjects, fetchFilters } from '../../api/todolist';

export default function ToDo() {
  useEffect(() => {
    document.title = 'To-do list | Neohabit';
  });

  return (
    <Routes>
      <Route element={<ToDoPageLayout />}>
        <Route index element={<Navigate to="all" />} />
        <Route path=":list/:projectID" element={<Editor />} >
          <Route path="task/:taskID" element={<Overlay />} />
        </Route>
        <Route path=":list" element={<Editor />} >
          <Route path="task/:taskID" element={<Overlay />} />
        </Route>
      </Route>
    </Routes>
  );
}

function ToDoPageLayout() {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    async function init() {
      const [projectsFetched, filtersFetched] = await Promise.all([
        fetchProjects(),
        fetchFilters(),
      ]);

      setProjects(projectsFetched);
      setFilters(filtersFetched);
    }
    init();
  }, []);

  return (
    <main className="tasklists">
      <Navigation projects={projects} filters={filters}/>
      <Outlet />
    </main>
  );
}
