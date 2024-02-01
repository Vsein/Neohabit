import React from 'react';
import { useGetHabitsQuery } from '../state/services/habit';
import { useGetProjectsQuery } from '../state/services/project';
import useLoaded from '../hooks/useLoaded';
import useDefaultProject from '../hooks/useDefaultProject';
import { ProjectWrapper } from './Project';

export default function Projectlist({
  datePeriodLength, mobile, dateStart, dateEnd, subPeriod, addPeriod
}) {
  const [loaded] = useLoaded();
  const projects = useGetProjectsQuery();
  const habits = useGetHabitsQuery();
  const [defaultProject] = useDefaultProject();

  if (!loaded || projects.isFetching || habits.isFetching) {
    return <div className="loader" />;
  }

  return (
    <div className="contentlist">
      {projects.data &&
          projects.data.map((project, i) => (
            <ProjectWrapper
              key={i}
              project={project}
              datePeriodLength={datePeriodLength}
              mobile={mobile}
              globalDateStart={dateStart}
              globalDateEnd={dateEnd}
              globalSubPeriod={subPeriod}
              globalAddPeriod={addPeriod}
            />
          ))}
      {defaultProject.habits.length ? (
        <ProjectWrapper
          project={defaultProject}
          datePeriodLength={datePeriodLength}
          mobile={mobile}
          globalDateStart={dateStart}
          globalDateEnd={dateEnd}
          subPeriod={subPeriod}
          addPeriod={addPeriod}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
