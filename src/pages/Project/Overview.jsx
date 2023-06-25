import React from 'react';
import { useParams } from 'react-router-dom';
import { subYears, startOfDay } from 'date-fns';
import { Heatmap } from '../../components/HeatmapFinal';
import { YearDataSimple, PERIODS6 } from '../../components/HeatmapData';
import { useGetTasksQuery } from '../../state/services/todolist';
import { useGetProjectsQuery } from '../../state/services/project';
import { useGetHeatmapsQuery } from '../../state/services/heatmap';
import Tasklist from '../../components/Tasklist';

export default function Project() {
  const tasks = useGetTasksQuery();
  const projects = useGetProjectsQuery();
  const heatmaps = useGetHeatmapsQuery();
  const { projectID } = useParams();
  const project =
    useGetProjectsQuery().data.find((projecto) => projecto._id == projectID) ??
    useGetProjectsQuery().data.find((projecto) => projecto.name == 'Default');
  const heatmap =
    useGetHeatmapsQuery().data.find((heatmapo) => heatmapo.project._id == projectID)

  console.log(heatmaps);

  const dateEnd = startOfDay(new Date());
  const dateStart = subYears(dateEnd, 1);
  const dayLength = 2;
  const yearData = YearDataSimple(dateStart);

  return tasks.isFetching || projects.isFetching || heatmaps.isFetching ? (
    <> </>
  ) : (
    <div className="project-overview" style={{ '--cell-height': '11px', '--cell-width': '11px' }}>
      <Heatmap
        heatmap={heatmap}
        // colorFunc={({ alpha }) => `rgba(3, 160, 3, ${alpha * 265})`}
        color={project.color}
        dateStart={dateStart}
        dateEnd={dateEnd}
        dayLength={dayLength}
        useElimination={false}
      />
      <Tasklist
        name="Tasks"
        tasks={tasks.data}
        projectID={projectID}
        list="project"
      />
    </div>
  );
}
