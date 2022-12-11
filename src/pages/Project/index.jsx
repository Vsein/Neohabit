import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';
import { useGetProjectsQuery } from '../../state/services/todolist';
import Header from './Header';
import Navigation from './Navigation';
import Overview from './Overview';

export default function Project() {
  useTitle('Project | Neohabit');

  return (
    <Routes>
      <Route element={<ProjectLayout />}>
        <Route index element={<Navigate to="overview" />} />
        <Route path="overview" element={<Overview />} />
        <Route path="heatmap" element={<Overview />} />
        <Route path="skill-tree" element={<Overview />} />
        <Route path="to-do" element={<Overview />} />
        <Route path="notes" element={<Overview />} />
      </Route>
    </Routes>
  );
}

function ProjectLayout() {
  const projects = useGetProjectsQuery();

  return projects.isFetching ? (
    <div className="loader" />
  ) : (
    <div id="content-project">
      <Header projects={projects.data} />
      <Navigation />
      <Outlet />
    </div>
  );
}
