import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Editor from './Editor';
import Overlay from './Overlay';
import Navigation from './Navigation';
import {
  useGetProjectsQuery,
  useGetFiltersQuery,
} from '../../state/services/todolist';
import useTitle from '../../hooks/useTitle';

export default function ToDoList() {
  useTitle('To-do list | Neohabit');

  return (
    <Routes>
      <Route element={<ToDoListLayout />}>
        <Route index element={<Navigate to="all" />} />
        <Route path=":list/:projectID" element={<Editor />}>
          <Route path="task/:taskID" element={<Overlay />} />
        </Route>
        <Route path=":list" element={<Editor />}>
          <Route path="task/:taskID" element={<Overlay />} />
        </Route>
      </Route>
    </Routes>
  );
}

function ToDoListLayout() {
  const projects = useGetProjectsQuery();
  const filters = useGetFiltersQuery();

  return (
    <main className="tasklists">
      {filters.isFetching || projects.isFetching ? (
        <div className="loader" />
      ) : (
        <Navigation projects={projects.data} filters={filters.data} />
      )}
      <Outlet />
    </main>
  );
}
