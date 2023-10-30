import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Editor from './Editor';
import Navigation from './Navigation';
import { useGetFiltersQuery } from '../../state/services/todolist';
import { useGetHabitsQuery } from '../../state/services/habit';
import useTitle from '../../hooks/useTitle';

export default function ToDoList() {
  useTitle('To-do list | Neohabit');

  return (
    <Routes>
      <Route element={<ToDoListLayout />}>
        <Route index element={<Navigate to="all" />} />
        <Route path=":list/:habitID" element={<Editor />} />
        <Route path=":list" element={<Editor />} />
      </Route>
    </Routes>
  );
}

function ToDoListLayout() {
  const habits = useGetHabitsQuery();
  const filters = useGetFiltersQuery();

  return filters.isFetching || habits.isFetching ? (
    <div className="loader" />
  ) : (
    <div className="page-tasklists">
      <Navigation habits={habits.data} filters={filters.data} />
      <Outlet />
    </div>
  );
}
