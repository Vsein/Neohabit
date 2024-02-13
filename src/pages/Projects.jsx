import React from 'react';
import { useDispatch } from 'react-redux';
import { changeTo } from '../state/features/overlay/overlaySlice';
import { useGetHabitsQuery } from '../state/services/habit';
import { useGetProjectsQuery } from '../state/services/project';
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
  const vertical = false;

  const dispatch = useDispatch();
  const openOverlay = () => {
    dispatch(changeTo({ projectID: '', type: 'project' }));
  };

  const { datePeriodLength, mobile } = useGetDatePeriodLength();

  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, subPeriod, addPeriod, setToPast, setToFuture, reset },
  ] = useDatePeriod(datePeriodLength, true);

  const [defaultProject] = useDefaultProject();

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
        />
      </div>
      {!loaded || projects.isFetching || habits.isFetching ? (
        <div className="loader" />
      ) : (
        <div className="contentlist"> {/* ProjectList */}
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
      )}
    </>
  );
}
