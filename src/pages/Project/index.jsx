import React from 'react';
import { useParams, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';
import useDefaultProject from '../../hooks/useDefaultProject';
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

  const [defaultProject] = useDefaultProject();

  return projects.isFetching || habits.isFetching ? (
    <div className="loader" />
  ) : (
    <div className="contentlist">
      <Project
        project={projects.data.find((projecto) => projecto._id === projectID) || defaultProject}
      />
    </div>
  );
}
