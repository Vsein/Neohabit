import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeTo } from '../state/features/overlay/overlaySlice';
import { useGetHabitsQuery } from '../state/services/habit';
import { useGetProjectsQuery } from '../state/services/project';
import { useGetSettingsQuery } from '../state/services/settings';
import useLoaded from '../hooks/useLoaded';
import useDefaultProject from '../hooks/useDefaultProject';
import useDatePeriod, { useGetDatePeriodLength } from '../hooks/useDatePeriod';
import { DatePeriodPicker } from '../components/DatePickers';
import { ProjectWrapper } from '../components/Project';
import useTitle from '../hooks/useTitle';

export default function ProjectsPage() {
  useTitle('Projects | Neohabit');
  const [loaded] = useLoaded();
  const projects = useGetProjectsQuery();
  const habits = useGetHabitsQuery();
  const settings = useGetSettingsQuery();
  const vertical = false;

  const dispatch = useDispatch();
  const openOverlay = () => {
    dispatch(changeTo({ projectID: '', type: 'project' }));
  };

  const { datePeriodLength, mobile } = useGetDatePeriodLength();

  const [projectsMap, setProjectsMap] = useState({});
  const [projectsOrder, setProjectsOrder] = useState(settings.data.projects_order);

  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subPeriod, addPeriod, setToPast, setToFuture, reset, isPastPeriod, isFuturePeriod },
  ] = useDatePeriod(datePeriodLength, true);

  const [defaultProject] = useDefaultProject();

  const DefaultProject = defaultProject.habits.length ? (
    <ProjectWrapper
      key='default'
      project={defaultProject}
      datePeriodLength={datePeriodLength}
      mobile={mobile}
    />
  ) : (
      <></>
    );

  return (
    <>
      <div className="contentlist-controls">
        <div className="overview-centering" style={{ width: 'max-content' }}>
          <button
            className={`overview-habit-add standalone topbar ${vertical ? 'vertical' : ''}`}
            onClick={openOverlay}
            title="Add a new project"
          >
            <p>New project</p>
          </button>
        </div>
        <DatePeriodPicker
          dateStart={dateStart}
          setDateStart={setDateStart}
          dateEnd={dateEnd}
          setDateEnd={setDateEnd}
          subPeriod={subPeriod}
          addPeriod={addPeriod}
          setToPast={setToPast}
          reset={reset}
          setToFuture={setToFuture}
          mobile={mobile}
          isPastPeriod={isPastPeriod}
          isFuturePeriod={isFuturePeriod}
        />
      </div>
      {!loaded || projects.isFetching || habits.isFetching || settings.isFetching ? (
        <div className="loader" />
      ) : (
        <div className="contentlist"> {/* ProjectList */}
            {settings.data.projects_enable_order && settings.data.projects_order && projects.data &&
                projectsOrder.flatMap((projectID, i) => {
                  projectsMap[projectID] = true;

                  if (projectID === 'default') return DefaultProject;

                  const project = projects.data.find((projecto) => projecto._id === projectID);

                  if (!project) return <React.Fragment key={i}></React.Fragment>;

                  return <ProjectWrapper
                    key={i}
                    project={project}
                    datePeriodLength={datePeriodLength}
                    mobile={mobile}
                  />;
                })
            }
            {projects.data && projects.data.map((project, i) =>
                projectsMap[project._id] ? <React.Fragment key={Object.keys(projectsMap).length * 10 + i}></React.Fragment> : (
                  <ProjectWrapper
                    key={Object.keys(projectsMap).length * 10 + i}
                    project={project}
                    datePeriodLength={datePeriodLength}
                    mobile={mobile}
                  />
                )
              )
            }
            {projectsMap.default ? <React.Fragment key='default'></React.Fragment> : DefaultProject}
        </div>
      )}
    </>
  );
}
