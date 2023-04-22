import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Editor from './Editor';
import Navigation from './Navigation';
import { useGetFiltersQuery } from '../../state/services/todolist';
import { useGetProjectsQuery } from '../../state/services/project';
import useTitle from '../../hooks/useTitle';

export default function ToDoList() {
  useTitle('To-do list | Neohabit');

  return (
    <Routes>
      <Route element={<ToDoListLayout />}>
        <Route index element={<Navigate to="all" />} />
        <Route path=":list/:projectID" element={<Editor />} />
        <Route path=":list" element={<Editor />} />
      </Route>
    </Routes>
  );
}

function ToDoListLayout() {
  const projects = useGetProjectsQuery();
  const filters = useGetFiltersQuery();

  return filters.isFetching || projects.isFetching ? (
    <div className="loader" />
  ) : (
    <main className="tasklists">
      <Navigation projects={projects.data} filters={filters.data} />
      <Outlet />
    </main>
  );
}
