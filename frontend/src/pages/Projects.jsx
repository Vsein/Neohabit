import React from 'react';
import { useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { Icon } from '@mdi/react';
import { mdiSortVariant } from '@mdi/js';
import { changeTo } from '../state/features/overlay/overlaySlice';
import { useGetProjectsQuery, useUpdateProjectMutation } from '../state/services/project';
import { useGetHabitsQuery } from '../state/services/habit';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../state/services/settings';
import useLoaded from '../hooks/useLoaded';
import useDefaultProject from '../hooks/useDefaultProject';
import useDatePeriod, { useGetDatePeriodLength } from '../hooks/useDatePeriod';
import { DatePeriodPicker } from '../components/DatePickers';
import Project from '../components/Project';
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
  const [updateSettings] = useUpdateSettingsMutation();

  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    {
      subYear,
      addYear,
      subPeriod,
      addPeriod,
      setToPast,
      setToFuture,
      reset,
      isPastPeriod,
      isFuturePeriod,
    },
  ] = useDatePeriod(datePeriodLength, true);

  const [defaultProject] = useDefaultProject();

  const dragHabitToProject = (
    fromProjectID,
    toProjectID,
    draggedHabitID,
    targetHabitID,
    insertAfter = false,
  ) => {
    const fromProject = structuredClone(
      projects.data.find((p) => p.id === fromProjectID) ?? defaultProject,
    );
    const toProject = structuredClone(
      projects.data.find((p) => p.id === toProjectID) ?? defaultProject,
    );
    const draggedHabit = fromProject.habits.find((h) => h.id === draggedHabitID);

    if (fromProject && fromProject.habits && fromProjectID !== 'default') {
      const filteredHabits = fromProject.habits.filter((h) => h.id !== draggedHabitID);
      const filteredHabitIDs = filteredHabits.map((h) => h.id);
      updateProject({
        projectID: fromProjectID,
        values: { habits: filteredHabits, habit_ids: filteredHabitIDs },
      });
    }

    if (toProject && toProject.habits && toProjectID !== 'default') {
      const i = toProject.habits.findIndex((h) => h.id === targetHabitID);
      toProject.habits.splice(i + insertAfter, 0, draggedHabit);
      const toProjectHabitIDs = toProject.habits.map((h) => h.id);
      updateProject({
        projectID: toProjectID,
        values: { habits: toProject.habits, habit_ids: toProjectHabitIDs },
      });
    }
  };

  const toggleOverviewMode = () =>
    updateSettings({
      values: {
        projects_enable_overview_mode: !settings.data.projects_enable_overview_mode,
      },
    });

  useHotkeys('shift+o', toggleOverviewMode);

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
        <button
          className={`sort-button centering ${settings.data.projects_enable_overview_mode ? 'active' : ''}`}
          onClick={toggleOverviewMode}
          title="Display all habits in the order they were created [O]"
        >
          <Icon path={mdiSortVariant} className="icon mirror" />
          <p>Overview mode</p>
        </button>
      </div>
      {!loaded || habits.isFetching ? (
        <div className="loader" />
      ) : (
        settings.data.projects_enable_overview_mode && (
          <div className="contentlist">
            <Project
              key="overview"
              project={{ name: 'Overview', color: '#8a8a8a', id: 'default', habits: habits.data }}
              mobile={mobile}
              globalDateStart={dateStart}
              globalDateEnd={dateEnd}
              addPeriod={addPeriod}
              subPeriod={subPeriod}
              isPastPeriod={isPastPeriod}
              isFuturePeriod={isFuturePeriod}
              singular
            />
          </div>
        )
      )}
      {!loaded || projects.isFetching || settings.isFetching ? (
        <div className="loader" />
      ) : (
        !settings.data.projects_enable_overview_mode && (
          <div className="contentlist">
            {projects.data.map((project, i) => (
              <Project
                key={i}
                project={project}
                mobile={mobile}
                globalDateStart={dateStart}
                globalDateEnd={dateEnd}
                subPeriod={subPeriod}
                addPeriod={addPeriod}
                isPastPeriod={isPastPeriod}
                isFuturePeriod={isFuturePeriod}
                dragHabitToProject={dragHabitToProject}
              />
            ))}
            {defaultProject?.habits?.length || projects.data.length === 0 ? (
              <Project
                key="default"
                project={defaultProject}
                mobile={mobile}
                globalDateStart={dateStart}
                globalDateEnd={dateEnd}
                subPeriod={subPeriod}
                addPeriod={addPeriod}
                isPastPeriod={isPastPeriod}
                isFuturePeriod={isFuturePeriod}
                dragHabitToProject={dragHabitToProject}
              />
            ) : (
              <></>
            )}
          </div>
        )
      )}
    </>
  );
}
