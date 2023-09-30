import React from 'react';
import { useParams, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';
import { useGetHabitsQuery } from '../../state/services/habit';
import { useGetProjectsQuery } from '../../state/services/project';
import Project from '../../components/Project';

export default function ProjectPage() {
  useTitle('Habit | Neohabit');

  return (
    <Routes>
      <Route element={<ProjectPageLayout />}>
        <Route index element={<Navigate to="overview" />} />
        <Route path="overview" />
      </Route>
    </Routes>
  );
}

function ProjectPageLayout() {
  const projects = useGetProjectsQuery();
  const habits = useGetHabitsQuery();
  const { projectID } = useParams();

  const defaultProject = {
    name: 'Default',
    color: '#eeeeee',
    habits: habits.data.filter((habit) => {
      const found =
        projects.data &&
        projects.data.find((project) =>
          project.habits.find((projectHabitID) => habit._id === projectHabitID),
        );
      return found === -1 || found === undefined;
    }),
    _id: '',
  };

  return projects.isFetching || habits.isFetching ? (
    <div className="loader" />
  ) : (
    <div id="content-habit">
      <div className="contentlist">
        <Project
          project={projects.data.find((projecto) => projecto._id === projectID) || defaultProject}
        />
      </div>
    </div>
  );
}
