import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import {
  differenceInDays,
  getDate,
  addDays,
  subMilliseconds,
  min,
  addHours,
  compareAsc,
} from 'date-fns';
import Icon from '@mdi/react';
import { mdiDelete, mdiPencil, mdiPlus } from '@mdi/js';
import { useGetProjectsQuery, useDeleteProjectMutation } from '../state/services/project';
import { useGetHeatmapsQuery } from '../state/services/heatmap';
import { CellPeriod, TallDummy } from './HeatmapCells';
import { changeTo, open } from '../state/features/projectOverlay/projectOverlaySlice';

function Month({ dateStart, index }) {
  const date = addDays(dateStart, index);
  const monthName = date.toLocaleString('en-US', { month: 'short' });
  if (getDate(date) === 1 || index === 0) {
    return <div className="overview-months-month active">{monthName}</div>;
  }
  return <div className="overview-months-month">{monthName}</div>;
}

function OverviewMonths({ dateStart, dateEnd }) {
  const days = Array.from(new Array(33));
  return (
    <div className="overview-months">
      {days.map((_, index) => (
        <Month key={index} index={index} dateStart={dateStart} />
      ))}
    </div>
  );
}

function Day({ dateStart, index }) {
  const date = addDays(dateStart, index);
  return <div className="overview-days-day">{getDate(date)}</div>;
}

function OverviewDays({ dateStart, dateEnd }) {
  const days = Array.from(new Array(differenceInDays(dateEnd, dateStart) + 1));
  return (
    <div className="overview-days">
      {days.map((_, index) => (
        <Day key={index} index={index} dateStart={dateStart} />
      ))}
    </div>
  );
}

function OverviewProjects({ dateStart, dateEnd }) {
  const projects = useGetProjectsQuery();
  const heatmaps = useGetHeatmapsQuery();

  if (projects.isFetching || heatmaps.isFetching) {
    return <div className="loader" />;
  }

  document.documentElement.style.setProperty('--projects', projects.data.length);

  return (
    <div className="overview-projects">
      {projects.data.map((project, i) => (
        <OverviewHeatmap
          key={i}
          project={project}
          dateStart={dateStart}
          dateEnd={dateEnd}
          heatmap={heatmaps.data.find(
            (heatmapo) => heatmapo.project._id == project._id,
          )}
        />
      ))}
    </div>
  );
}

function OverviewHeatmap({
  dateStart,
  dateEnd,
  project,
  heatmap,
  useElimination = true,
}) {
  const [deleteProject] = useDeleteProjectMutation();
  const dispatch = useDispatch();
  const deleteChosenProject = (e) => {
    deleteProject(project._id);
  };
  let dateNow = dateStart;
  const data = heatmap?.data;
  let dataSorted;
  if (data) {
    dataSorted = [...data];
    dataSorted.sort((a, b) => compareAsc(new Date(a.date), new Date(b.date)));
    console.log(dataSorted);
  }
  const linkify = (str) => str.replace(/\s+/g, '-').toLowerCase();


  return (
    <div className="overview-project">
      <NavLink
        className="overview-project-name"
        to={`../project/${linkify(project._id)}`}
      >
        {project.name}
      </NavLink>
      <div
        className="overview-project-cells"
        style={{ '--cell-height': '15px', '--cell-width': '15px' }}
      >
        {dataSorted ? (
          dataSorted.map((point, index) => {
            const date = new Date(point.date);
            const gap = differenceInDays(date, dateNow);
            if (gap < 0) return <> </>;
            dateNow = addDays(date, 1);
            return (
              <>
                {gap > 1 ? <TallDummy height={gap} vertical={true} /> : <> </>}
                <CellPeriod
                  dateStart={date}
                  dateEnd={addDays(date, 1)}
                  color={project.color}
                  value={1}
                  multiplier={1}
                  basePeriod={24}
                  vertical={true}
                />
              </>
            );
          })
        ) : (
          <></>
        )}
      </div>
      <div className="overview-project-controls">
        <button className="overview-project-button">
          <Icon path={mdiPlus} />
        </button>
        <Link
          className="overview-project-button"
          onClick={() => {
            dispatch(changeTo(project._id));
            dispatch(open());
          }}>
          <Icon path={mdiPencil} />
        </Link>
        <button className="overview-project-button" onClick={deleteChosenProject}>
          <Icon path={mdiDelete} />
        </button>
      </div>
    </div>
  );
}

export { OverviewMonths, OverviewDays, OverviewProjects };
