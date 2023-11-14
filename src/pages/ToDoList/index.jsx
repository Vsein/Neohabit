import React from 'react';
import { Routes, Route, Navigate, Outlet, NavLink } from 'react-router-dom';
import { Icon } from '@mdi/react';
import { mdiSquareSmall, mdiFormatListGroup } from '@mdi/js';
import Editor from './Editor';
import useTitle from '../../hooks/useTitle';
import { useGetTasksQuery } from '../../state/services/todolist';
import { useGetHabitsQuery } from '../../state/services/habit';

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
  const tasks = useGetTasksQuery();
  const habits = useGetHabitsQuery();

  return tasks.isFetching || habits.isFetching ? (
    <div className="loader" />
  ) : (
    <div className="page-tasklists">
      <Navigation />
      <Outlet />
    </div>
  );
}

function Navigation() {
  return (
    <nav className="tasklists-navigation">
      <ul className="filters">
        <li>
          <Filter filter={{ name: 'All', image: mdiSquareSmall }} />
        </li>
        {/* <li> */}
        {/*   <Filter filter={{ name: 'Grouped', image: mdiFormatListGroup }} /> */}
        {/* </li> */}
      </ul>
    </nav>
  );
}

function Filter(props) {
  const { filter } = props;

  const linkify = (str) => str.replace(/\s+/g, '-').toLowerCase();

  return (
    <NavLink
      className={({ isActive }) => (isActive ? 'filter active' : 'filter')}
      to={`${linkify(filter.name)}`}
    >
      <Icon path={filter.image} height="20px" width="20px" />
      <p>{filter.name}</p>
    </NavLink>
  );
}
