import React from 'react';
import { useParams, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import useTitle from '../hooks/useTitle';
import useDefaultProject from '../hooks/useDefaultProject';
import { useGetHabitsQuery } from '../state/wrappers/habit';
import { useGetProjectsQuery } from '../state/services/project';
import { useGetSettingsQuery } from '../state/services/settings';
import useDatePeriod, { getAdaptivePeriodLength } from '../hooks/useDatePeriod';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { ReturnButton } from '../components/HabitComponents';
import Project from '../components/Project';
import { DatePeriodPicker } from '../components/DatePickers';
import { useShadeGenerator } from '../hooks/usePaletteGenerator';

export default function ProjectPage() {
  useTitle('Habit | Neohabit');

  return (
    <Routes>
      <Route element={<ProjectPageLayout />}>
        <Route index element={<Navigate to="overview" />} />
        <Route path="overview" />
      </Route>
    </Routes>
  );
}

function ProjectPageLayout() {
  const navigate = useNavigate();
  const projects = useGetProjectsQuery();
  const habits = useGetHabitsQuery();
  const settings = useGetSettingsQuery();
  const { projectID } = useParams();
  const vertical = false;

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

  const [defaultProject] = useDefaultProject();

  if (projects.isFetching || habits.isFetching) {
    return <div className="loader" />;
  }

  const project = projects.data.find((projecto) => projecto._id === projectID) ?? defaultProject;

  const { colorShade, calmColorShade, textColor, calmTextColor } = useShadeGenerator(project.color);

  return projects.isFetching || habits.isFetching ? (
    <div className="loader" />
  ) : (
    <>
      <div
        className="contentlist-controls"
        style={{
          '--signature-color': colorShade,
          '--bright-signature-color': colorShade,
          '--calm-signature-color': `${colorShade}55`,
          '--datepicker-text-color': textColor,
          '--datepicker-calm-text-color': calmTextColor,
        }}
      >
        <div className="overview-centering" style={{ width: 'max-content' }}>
          <button
            className={`overview-habit-add standalone topbar ${vertical ? 'vertical' : ''}`}
            onClick={() => navigate(-1)}
            style={{ gridTemplateColumns: 'min-content 150px' }}
            title="Add a new habit [A]"
          >
            <ReturnButton />
            <p>Return</p>
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
      </div>
      <div className="contentlist">
        <Project
          project={project}
          datePeriodLength={datePeriodLength}
          mobile={mobile}
          singular={true}
          globalDateStart={dateStart}
          globalDateEnd={dateEnd}
          subPeriod={subPeriod}
          addPeriod={addPeriod}
        />
      </div>
    </>
  );
}
