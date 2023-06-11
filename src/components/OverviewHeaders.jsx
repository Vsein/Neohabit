import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  differenceInDays,
  getDate,
  addDays,
  subMilliseconds,
  min,
  addHours,
  compareAsc,
} from 'date-fns';
import { useGetProjectsQuery } from '../state/services/project';
import { useGetHeatmapsQuery } from '../state/services/heatmap';
import { CellPeriod, TallDummy } from './HeatmapCells';

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
    </div>
  );
}

export { OverviewMonths, OverviewDays, OverviewProjects };
