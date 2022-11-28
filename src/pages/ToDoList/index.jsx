import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Editor from './Editor';
import Overlay from './Overlay';
import Navigation from './Navigation';
import { fetchProjects, fetchFilters } from '../../utils/todolist';
import { useGetProjectsQuery, useGetFiltersQuery, useGetTasksQuery } from '../../state/services/todolist';

export default function ToDoList() {
  useEffect(() => {
    document.title = 'To-do list | Neohabit';
  });

  return (
    <Routes>
      <Route element={<ToDoListLayout />}>
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

function ToDoListLayout() {
  const projects = useGetProjectsQuery();
  const filters = useGetFiltersQuery();
  const { pathname } = useLocation();

  return (
    <main className="tasklists">
      {
        filters.isFetching || projects.isFetching ?
          <div className="loader"/>
          :
          <Navigation projects={projects.data} filters={filters.data}/>
      }
      <Outlet />
    </main>
  );
}
