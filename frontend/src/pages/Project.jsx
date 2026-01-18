import React from 'react';
import { useParams, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import useTitle from '../hooks/useTitle';
import useDefaultProject from '../hooks/useDefaultProject';
import { useGetProjectsQuery } from '../state/services/project';
import useDatePeriod, { useGetDatePeriodLength } from '../hooks/useDatePeriod';
import { ReturnButton } from '../components/HabitComponents';
import Project from '../components/Project';
import { DatePeriodPicker } from '../components/DatePickers';
import { generateShades } from '../hooks/usePaletteGenerator';

export default function ProjectPage() {
  useTitle('Project | Neohabit');

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
  const { projectID } = useParams();
  const vertical = false;

  const { datePeriodLength, mobile } = useGetDatePeriodLength();

  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, subPeriod, addPeriod, setToPast, setToFuture, reset },
  ] = useDatePeriod(datePeriodLength, true);

  const [defaultProject] = useDefaultProject();

  if (projects.isFetching) {
    return <div className="loader" />;
  }

  const project = projects.data.find((p) => p.id === projectID) ?? defaultProject;

  const { colorShade, calmColorShade, textColor, calmTextColor } = generateShades(project.color);

  return (
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
          mobile={mobile}
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
