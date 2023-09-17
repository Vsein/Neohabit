import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import {
  mdiMenuLeft,
  mdiMenuRight,
  mdiMenuUp,
  mdiMenuDown,
  mdiCalendarText,
  mdiCalendarWeekend,
  mdiCalendarEnd,
  mdiCalendarStart,
  mdiCalendarRefresh,
  mdiCog,
  mdiPlus,
} from '@mdi/js';
import { useGetProjectsQuery } from '../state/services/project';
import { useGetHeatmapsQuery } from '../state/services/heatmap';
import {
  useGetSettingsQuery,
  useChangeOverviewOrientationMutation,
} from '../state/services/settings';
import { changeTo, open } from '../state/features/projectOverlay/projectOverlaySlice';
import useLoaded from '../hooks/useLoaded';
import useDatePeriod from '../hooks/useDatePeriod';
import { HeatmapMonthsDaily, HeatmapDays } from './HeatmapDateAxes';
import { YearPicker, DatePeriodPicker } from './DatePickers';
import Heatmap from './Heatmap';
import ProjectControls from './ProjectComponents';
import useKeyPress from '../hooks/useKeyPress';

export default function Overview() {
  const [loaded] = useLoaded();
  const projects = useGetProjectsQuery();
  const heatmaps = useGetHeatmapsQuery();
  const settings = useGetSettingsQuery();
  const vertical = settings.data.overview_vertical;

  const datePeriodLength = settings.data?.overview_duration ?? 32;
  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, setToPast, setToFuture, reset },
  ] = useDatePeriod(datePeriodLength - 1);
  useKeyPress(['h'], subMonth);
  useKeyPress(['l'], addMonth);

  const dispatch = useDispatch();
  const openOverlay = () => {
    dispatch(open());
    dispatch(changeTo(''));
  };
  useKeyPress(['a'], openOverlay);

  if (!loaded || projects.isFetching || heatmaps.isFetching) {
    return (
      <div className="overview-loader cetering">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div
      className="overview-centering"
      style={{
        '--projects': projects.data.length,
        '--length': datePeriodLength,
        '--vertical': vertical * 1,
        // '--multiplier': settings.data.cell_height_multiplier,
        '--multiplier': 1,
        '--cell-height': '15px',
        '--cell-width': '15px',
      }}
    >
      <div
        className={`overview-header ${vertical ? 'vertical' : ''} ${
          datePeriodLength < 14 ? 'small' : ''
        }`}
      >
        <h3>Overview</h3>
        <DatePeriodPicker
          dateStart={dateStart}
          setDateStart={setDateStart}
          dateEnd={dateEnd}
          setDateEnd={setDateEnd}
        />
        <OverviewSettings vertical={vertical} />
      </div>
      <div className={`overview-container ${vertical ? 'vertical' : ''}`}>
        <div className={`overview ${vertical ? 'vertical' : ''}`}>
          <div className="overview-topbar-left">
            {!vertical && <YearPicker subYear={subYear} addYear={addYear} dateStart={dateStart} />}
            <button
              className="centering"
              onClick={subMonth}
              title="Move month to the left [H]"
            >
              <Icon path={vertical ? mdiMenuUp : mdiMenuLeft} className="icon" />
            </button>
          </div>
          <HeatmapMonthsDaily dateStart={dateStart} dateEnd={dateEnd} />
          <HeatmapDays dateStart={dateStart} dateEnd={dateEnd} />
          <div className="overview-topbar-right">
            {vertical ? (
              <YearPicker subYear={subYear} addYear={addYear} dateStart={dateStart} />
            ) : (
              <button
                className="centering"
                onClick={addMonth}
                title="Move month to the right [L]"
              >
                <Icon path={mdiMenuRight} className="icon" />
              </button>
            )}
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
                heatmap={heatmaps.data.find((heatmapo) => heatmapo.project._id === project._id)}
                vertical={vertical}
              />
            ))}
          </div>
          {vertical && (
            <button
              className="overview-period-move-down"
              onClick={addMonth}
              title="Move month to the right [L]"
            >
              <Icon path={mdiMenuDown} className="icon" />
            </button>
          )}
        </div>
      </div>
      <button
        className={`overview-project-add ${vertical ? 'vertical' : ''}`}
        onClick={openOverlay}
        title="Add project [A]"
      >
        <Icon className="icon small" path={mdiPlus} />
        <p>Add project</p>
      </button>
    </div>
  );
}

function OverviewProject({ dateStart, dateEnd, project, heatmap, vertical }) {
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
      <Heatmap
        heatmap={heatmap}
        project={project}
        dateStart={dateStart}
        dateEnd={dateEnd}
        vertical={vertical}
        isOverview={true}
      />
      <ProjectControls project={project} heatmap={heatmap} />
    </div>
  );
}

function OverviewSettings({ vertical }) {
  const [changeOverview] = useChangeOverviewOrientationMutation();

  return (
    <div className="overview-settings">
      <button
        className={`overview-open-settings ${vertical ? '' : 'active'}`}
        onClick={() => changeOverview(false)}
        title="Change to horizontal orientation"
      >
        <Icon path={mdiCalendarText} className="icon small centering" />
      </button>
      <button
        className={`overview-open-settings ${vertical ? 'active' : ''}`}
        onClick={() => changeOverview(true)}
        title="Change to vertical orientation"
      >
        <Icon path={mdiCalendarWeekend} className="icon small centering" />
      </button>
      <NavLink
        className="overview-open-settings"
        to="/settings#overview"
        title="Open overview settings"
      >
        <Icon path={mdiCog} className="icon small centering" />
      </NavLink>
    </div>
  );
}
