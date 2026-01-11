import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeTo } from '../state/features/overlay/overlaySlice';
import { useGetHabitsQuery } from '../state/services/habit';
import { useGetProjectsQuery, useUpdateProjectMutation } from '../state/services/project';
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

  const [updateProject] = useUpdateProjectMutation();

  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subPeriod, addPeriod, setToPast, setToFuture, reset, isPastPeriod, isFuturePeriod },
  ] = useDatePeriod(datePeriodLength, true);

  const [defaultProject] = useDefaultProject();

  const dragHabitToProject = async (fromProjectID, toProjectID, draggedHabitID, targetHabitID, insertAfter = false) => {
    const fromProject = structuredClone(projects.data.find((p) => p.id === fromProjectID) ?? defaultProject);
    const toProject = structuredClone(projects.data.find((p) => p.id === toProjectID) ?? defaultProject);
    if (fromProject && fromProject.habits && fromProjectID !== 'default') {
      await updateProject({ projectID: fromProjectID, values: { habits: fromProject.habits.filter((habitID) => habitID !== draggedHabitID) } });
    }
    if (toProject && toProject.habits && toProjectID !== 'default') {
      const position = toProject.habits.findIndex((habit) => habit === targetHabitID);
      toProject.habits.splice(position + insertAfter, 0, draggedHabitID);
      await updateProject({ projectID: toProjectID, values: { habits: toProject.habits } });
    }
  };

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
        <div className="contentlist">
          {projects.data.map((project, i) =>
            <ProjectWrapper
              key={i}
              project={project}
              datePeriodLength={datePeriodLength}
              mobile={mobile}
              dragHabitToProject={dragHabitToProject}
            />
          )}
          {
            defaultProject.habits.length ? (
              <ProjectWrapper
                key='default'
                project={defaultProject}
                datePeriodLength={datePeriodLength}
                mobile={mobile}
              />
            ) : (
              <></>
            )
          }
        </div>
      )}
    </>
  );
}
