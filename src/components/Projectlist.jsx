import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Icon } from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { useGetHabitsQuery } from '../state/services/habit';
import { useGetProjectsQuery } from '../state/services/project';
import { useGetSettingsQuery } from '../state/services/settings';
import { changeTo } from '../state/features/overlay/overlaySlice';
import useDatePeriod, { getAdaptivePeriodLength } from '../hooks/useDatePeriod';
import useWindowDimensions from '../hooks/useWindowDimensions';
import useLoaded from '../hooks/useLoaded';
import useKeyPress from '../hooks/useKeyPress';
import useDefaultProject from '../hooks/useDefaultProject';
import Project from './Project';
import { DatePeriodPicker, OverviewTopbarRight } from './DatePickers';

export default function Projectlist() {
  const [loaded] = useLoaded();
  const projects = useGetProjectsQuery();
  const habits = useGetHabitsQuery();
  const settings = useGetSettingsQuery();
  const vertical = false;

  const dispatch = useDispatch();
  const openOverlay = () => {
    dispatch(changeTo({ projectID: '', type: 'project' }));
  };

  const [defaultProject] = useDefaultProject();

  const { width } = useWindowDimensions();
  const { adaptiveDatePeriodLength, mobile } = getAdaptivePeriodLength(width);
  const datePeriodLength =
    settings.data?.overview_adaptive ?? true
      ? Math.min(
          adaptiveDatePeriodLength,
          settings.data?.overview_apply_limit ?? true
            ? settings.data?.overview_duration_limit ?? 32
            : Infinity,
        )
      : settings.data?.overview_duration ?? 32;

  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, subPeriod, addPeriod, setToPast, setToFuture, reset },
  ] = useDatePeriod(datePeriodLength, true);

  if (!loaded || projects.isFetching || habits.isFetching || settings.isFetching) {
    return <div className="loader" />;
  }

  return (
    <>
      <div className="contentlist-controls">
        <div className="overview-centering" style={{ width: 'max-content' }}>
          <button
            className={`overview-habit-add standalone topbar ${vertical ? 'vertical' : ''}`}
            onClick={openOverlay}
            title="Add a new habit [A]"
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
        />
        <OverviewTopbarRight
          isHeatmap={false}
          vertical={vertical}
          dateStart={dateStart}
          subYear={subYear}
          addYear={addYear}
          addMonth={addMonth}
        />
      </div>
      <div className="contentlist">
        {projects.data &&
          projects.data.map((project, i) => (
            <Project
              key={i}
              project={project}
              datePeriodLength={datePeriodLength}
              mobile={mobile}
              globalDateStart={dateStart}
              globalDateEnd={dateEnd}
              subPeriod={subPeriod}
              addPeriod={addPeriod}
            />
          ))}
        {defaultProject.habits.length ? (
          <Project
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
    </>
  );
}
