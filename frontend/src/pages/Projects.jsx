import React from 'react';
import { useDispatch } from 'react-redux';
import { changeTo } from '../state/features/overlay/overlaySlice';
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

  const dragHabitToProject = (fromProjectID, toProjectID, draggedHabitID, targetHabitID, insertAfter = false) => {
    const fromProject = structuredClone(projects.data.find((p) => p.id === fromProjectID) ?? defaultProject);
    const toProject = structuredClone(projects.data.find((p) => p.id === toProjectID) ?? defaultProject);
    const draggedHabit = fromProject.habits.find((h) => h.id === draggedHabitID);

    if (fromProject && fromProject.habits && fromProjectID !== 'default') {
      const filteredHabits = fromProject.habits.filter((h) => h.id !== draggedHabitID);
      const filteredHabitIDs = filteredHabits.map((h) => h.id);
      updateProject({ projectID: fromProjectID, values: { habits: filteredHabits, habit_ids: filteredHabitIDs } });
    }

    if (toProject && toProject.habits && toProjectID !== 'default') {
      const i = toProject.habits.findIndex((h) => h.id === targetHabitID);
      toProject.habits.splice(i + insertAfter, 0, draggedHabit);
      const toProjectHabitIDs = toProject.habits.map((h) => h.id);
      updateProject({ projectID: toProjectID, values: { habits: toProject.habits, habit_ids: toProjectHabitIDs } });
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
      {!loaded || projects.isFetching || settings.isFetching ? (
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
            defaultProject?.habits?.length ? (
              <ProjectWrapper
                key='default'
                project={defaultProject}
                datePeriodLength={datePeriodLength}
                mobile={mobile}
                dragHabitToProject={dragHabitToProject}
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
