import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getYear, formatISO, startOfDay, differenceInDays } from 'date-fns';
import Icon from '@mdi/react';
import {
  mdiDelete,
  mdiPencil,
  mdiPlusBox,
  mdiTimer,
  mdiMenuLeft,
  mdiMenuRight,
  mdiCheckboxMarked,
  mdiCalendarEnd,
  mdiCalendarStart,
  mdiCalendarRefresh,
  mdiViewGridPlusOutline,
  mdiPlus,
  mdiCog,
} from '@mdi/js';
import { useGetProjectsQuery, useDeleteProjectMutation } from '../state/services/project';
import { useGetHeatmapsQuery, useUpdateHeatmapMutation } from '../state/services/heatmap';
import { useGetSettingsQuery } from '../state/services/settings';
import { changeTo, open } from '../state/features/projectOverlay/projectOverlaySlice';
import { changeHeatmapTo } from '../state/features/cellAdd/cellAddSlice';
import useLoaded from '../hooks/useLoaded';
import useDatePeriod from '../hooks/useDatePeriod';
import { OverviewMonths, OverviewDays } from './OverviewHeaders';
import { useUpdateStopwatchMutation } from '../state/services/stopwatch';
import OverviewHeatmap from './OverviewHeatmap';
import useKeyPress from '../hooks/useKeyPress';

export default function Overview() {
  const [loaded] = useLoaded();
  const projects = useGetProjectsQuery();
  const heatmaps = useGetHeatmapsQuery();
  const settings = useGetSettingsQuery();
  const vertical = settings.data.overview_vertical;
  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, setToPast, setToFuture, reset },
  ] = useDatePeriod();

  const dispatch = useDispatch();

  const openOverlay = () => {
    dispatch(open());
    dispatch(changeTo(''));
  };

  useKeyPress(['a'], openOverlay);

  const datePeriodLength = differenceInDays(dateEnd, dateStart) + 1;

  useKeyPress(['h'], subMonth);
  useKeyPress(['l'], addMonth);

  if (!loaded || projects.isFetching || heatmaps.isFetching) {
    return (
      <div className="overview-loader cetering">
        <div className="loader" />
      </div>
    );
  }

  document.documentElement.style.setProperty('--projects', projects.data.length);

  return (
    <>
      <div className="overview-header" style={{ '--length': datePeriodLength }}>
        <h3>Overview</h3>
        <OverviewDates
          dateStart={dateStart}
          setDateStart={setDateStart}
          dateEnd={dateEnd}
          setDateEnd={setDateEnd}
        />
        <div className="overview-settings">
          <NavLink
            className="overview-open-settings"
            to="/settings#overview"
            title="Open overview settings"
          >
            <Icon path={mdiCog} className="icon small centering" />
          </NavLink>
        </div>
      </div>
      <div
        className="overview-container"
        style={{
          // '--multiplier': settings.data.cell_height_multiplier,
          '--multiplier': 1,
          '--negate-margin-block': 2,
          '--cell-height': '15px',
          '--cell-width': '15px',
          '--length': datePeriodLength,
        }}
      >
        <div className="overview">
          <div className="overview-topbar-left">
            <OverviewYear subYear={subYear} addYear={addYear} dateStart={dateStart} />
            <button
              className="overview-period-move-left"
              onClick={subMonth}
              title="Move month to the left [H]"
            >
              <Icon path={mdiMenuLeft} className="icon" />
            </button>
          </div>
          <OverviewMonths dateStart={dateStart} dateEnd={dateEnd} />
          <OverviewDays dateStart={dateStart} dateEnd={dateEnd} />
          <div className="overview-topbar-right">
            <button
              className="overview-period-move-right"
              onClick={addMonth}
              title="Move month to the right [L]"
            >
              <Icon path={mdiMenuRight} className="icon" />
            </button>
            <button
              className="overview-period-end"
              onClick={setToPast}
              title="Set today as the period end"
            >
              <Icon path={mdiCalendarEnd} className="icon small centering" />
            </button>
            <button
              className="overview-period-start"
              onClick={reset}
              title="Reset date period to preferred defaults"
            >
              <Icon path={mdiCalendarRefresh} className="icon small centering" />
            </button>
            <button
              className="overview-period-start"
              onClick={setToFuture}
              title="Set today as the period start"
            >
              <Icon path={mdiCalendarStart} className="icon small centering" />
            </button>
          </div>
          <div className="overview-projects">
            {projects.data.map((project, i) => (
              <OverviewProject
                key={i}
                project={project}
                dateStart={dateStart}
                dateEnd={dateEnd}
                heatmap={heatmaps.data.find((heatmapo) => heatmapo.project._id == project._id)}
              />
            ))}
          </div>
        </div>
      </div>
      <button
        className="overview-project-add"
        onClick={openOverlay}
        title="Add project [A]"
        style={{ '--length': datePeriodLength }}
      >
        <Icon className="icon small" path={mdiPlus} />
        <p>Add project</p>
      </button>
    </>
  );
}

function OverviewProject({ dateStart, dateEnd, project, heatmap }) {
  const [deleteProject] = useDeleteProjectMutation();
  const [updateStopwatch] = useUpdateStopwatchMutation();
  const [updateHeatmap] = useUpdateHeatmapMutation();
  const dispatch = useDispatch();
  const deleteChosenProject = (e) => {
    deleteProject(project._id);
  };
  const setStopwatchProject = () => {
    updateStopwatch({
      values: {
        project: project,
      },
    });
  };
  const addCell = async () => {
    await updateHeatmap({
      heatmapID: heatmap?._id,
      values: { value: 1, date: Date.now() },
    });
  };
  const openCellAddDropdown = (e, isTarget) => {
    e.stopPropagation();
    dispatch(changeHeatmapTo({ heatmapID: heatmap?._id, isActive: true, isTarget }));
    const cellAddDropdown = document.querySelector('.cell-add-dropdown');
    const cell = e.target;
    const rect = cell.getBoundingClientRect();
    cellAddDropdown.style.top = `${window.pageYOffset + rect.y - 21 - (isTarget ? 10 : 0)}px`;
    cellAddDropdown.style.left = `${rect.x + rect.width / 2 - 245 - (isTarget ? 100 : 0)}px`;
    cellAddDropdown.style.borderColor = project.color;
  };

  const linkify = (str) => str.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="overview-project">
      <NavLink
        className="overview-project-name"
        to={`../project/${linkify(project._id)}`}
        title={project.name}
      >
        {project.name}
      </NavLink>
      <OverviewHeatmap
        heatmap={heatmap}
        project={project}
        dateStart={dateStart}
        dateEnd={dateEnd}
      />
      <div className="overview-project-controls" style={{ '--color': project.color }}>
        <button
          className="overview-project-button"
          onClick={(e) => openCellAddDropdown(e, false)}
          title="Add N copmleted actions on X day"
        >
          <Icon path={mdiPlusBox} />
        </button>
        <button
          className="overview-project-button"
          onClick={addCell}
          title="Add 1 completed action today"
        >
          <Icon path={mdiCheckboxMarked} />
        </button>
        <button
          className="overview-project-button"
          onClick={setStopwatchProject}
          title="Start stopwatch of this project"
        >
          <Icon path={mdiTimer} />
        </button>
        <button
          className="overview-project-button"
          onClick={(e) => openCellAddDropdown(e, true)}
          title="Add a new target"
        >
          <Icon path={mdiViewGridPlusOutline} />
        </button>
        <Link
          className="overview-project-button"
          onClick={() => {
            dispatch(changeTo(project._id));
            dispatch(open());
          }}
          title="Edit project"
        >
          <Icon path={mdiPencil} />
        </Link>
        <button
          className="overview-project-button"
          onClick={deleteChosenProject}
          title="Delete project"
        >
          <Icon path={mdiDelete} />
        </button>
      </div>
    </div>
  );
}

function OverviewYear({ subYear, addYear, dateStart }) {
  return (
    <div className="overview-year-move">
      <button className="overview-period-move-left" onClick={subYear}>
        <Icon path={mdiMenuLeft} className="icon" />
      </button>
      <h3>{getYear(dateStart)}</h3>
      <button className="overview-period-move-right" onClick={addYear}>
        <Icon path={mdiMenuRight} className="icon" />
      </button>
    </div>
  );
}

function OverviewDates({ setDateStart, dateStart, setDateEnd, dateEnd }) {
  return (
    <div className="overview-dates">
      <input
        type="date"
        value={formatISO(dateStart, { representation: 'date' })}
        max="<?= date('Y-m-d'); ?>"
        rows="1"
        className="overview-dates-picker"
        onChange={(e) => setDateStart(startOfDay(new Date(e.target.value)))}
      />
      -
      <input
        type="date"
        value={formatISO(dateEnd, { representation: 'date' })}
        max="<?= date('Y-m-d'); ?>"
        rows="1"
        className="overview-dates-picker"
        onChange={(e) => setDateEnd(startOfDay(new Date(e.target.value)))}
      />
    </div>
  );
}
