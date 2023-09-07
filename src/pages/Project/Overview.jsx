import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetTasksQuery } from '../../state/services/todolist';
import { useGetProjectsQuery } from '../../state/services/project';
import { useGetHeatmapsQuery } from '../../state/services/heatmap';
import Project from '../../components/Project';

export default function ProjectOverview() {
  const tasks = useGetTasksQuery();
  const projects = useGetProjectsQuery();
  const heatmaps = useGetHeatmapsQuery();
  const { projectID } = useParams();
  const project =
    useGetProjectsQuery().data.find((projecto) => projecto._id === projectID) ??
    useGetProjectsQuery().data.find((projecto) => projecto.name === 'Default');
  const heatmap = useGetHeatmapsQuery().data.find((heatmapo) => heatmapo.project._id === projectID);

  return tasks.isFetching || projects.isFetching || heatmaps.isFetching ? (
    <> </>
  ) : (
    <Project
      heatmap={heatmap}
      project={project}
    />
  );
}
