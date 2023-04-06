import React from 'react';
import { useParams } from 'react-router-dom';
import { subYears, startOfDay } from 'date-fns';
import { Heatmap } from '../../components/Heatmap';
import { YearDataSimple, PERIODS6 } from '../../components/HeatmapData';
import { useGetTasksQuery } from '../../state/services/todolist';
import { useGetProjectsQuery } from '../../state/services/project';
import Tasklist from '../../components/Tasklist';

export default function Project() {
  const tasks = useGetTasksQuery();
  const projects = useGetProjectsQuery();
  const { projectID } = useParams();
  const project =
    useGetProjectsQuery().data.find((projecto) => projecto._id == projectID) ??
    useGetProjectsQuery().data.find((projecto) => projecto.name == 'Default');

  const dateEnd = startOfDay(new Date());
  const dateStart = subYears(dateEnd, 1);
  const dayLength = 2;
  const yearData = YearDataSimple(dateStart);

  return tasks.isFetching || projects.isFetching ? (
    <> </>
  ) : (
    <div className="project-overview">
      <Heatmap
        data={yearData}
        dataPeriods={PERIODS6}
        // colorFunc={({ alpha }) => `rgba(3, 160, 3, ${alpha * 265})`}
        colorFunc={({ alpha }) => {
          const alphaHex = Math.round(alpha * 265).toString(16);
          return `${project.color}${alphaHex}`;
        }
        }
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
