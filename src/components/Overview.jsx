import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  differenceInDays,
  addDays,
  compareAsc,
  startOfDay,
  endOfDay,
  min,
  max,
  isSameDay,
  getYear,
  subMilliseconds,
} from 'date-fns';
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
  mdiCalendarRefresh,
  mdiViewGridPlusOutline,
} from '@mdi/js';
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from '../state/services/project';
import {
  useGetHeatmapsQuery,
  useUpdateHeatmapMutation,
} from '../state/services/heatmap';
import { useGetSettingsQuery } from '../state/services/settings';
import { CellPeriod, Cell, CellDummy } from './HeatmapCells';
import {
  changeTo,
  open,
} from '../state/features/projectOverlay/projectOverlaySlice';
import { changeHeatmapTo } from '../state/features/cellAdd/cellAddSlice';
import useLoaded from '../hooks/useLoaded';
import usePaletteGenerator from '../hooks/usePaletteGenerator';
import useDatePeriod from '../hooks/useDatePeriod';
import { OverviewMonths, OverviewDays } from './OverviewHeaders';
import { useUpdateStopwatchMutation } from '../state/services/stopwatch';

export default function Overview() {
  const [loaded] = useLoaded();
  const projects = useGetProjectsQuery();
  const heatmaps = useGetHeatmapsQuery();
  const settings = useGetSettingsQuery();
  const [dateEnd, dateStart, { subMonth, addMonth, subYear, addYear, setToPast, refresh }] =
    useDatePeriod();

  if (!loaded || projects.isFetching || heatmaps.isFetching) {
    return (
      <div className="overview-loader cetering">
        <div className="loader" />
      </div>
    );
  }

  document.documentElement.style.setProperty(
    '--projects',
    projects.data.length,
  );

  return (
    <div
      className="overview"
      style={{
        // '--multiplier': settings.data.cell_height_multiplier,
        '--multiplier': 1,
      }}
    >
      <div className="overview-topbar-left">
        <div className="overview-year-move">
          <button className="overview-period-move-left" onClick={subYear}>
            <Icon path={mdiMenuLeft} className="icon" />
          </button>
          <h3>{getYear(dateStart)}</h3>
          <button className="overview-period-move-right" onClick={addYear}>
            <Icon path={mdiMenuRight} className="icon" />
          </button>
        </div>

        <button className="overview-period-move-left" onClick={subMonth}>
          <Icon path={mdiMenuLeft} className="icon" />
        </button>
      </div>
      <OverviewMonths dateStart={dateStart} dateEnd={dateEnd} />
      <OverviewDays dateStart={dateStart} dateEnd={dateEnd} />
      <div className="overview-topbar-right">
        <button className="overview-period-move-right" onClick={addMonth}>
          <Icon path={mdiMenuRight} className="icon" />
        </button>
        <button className="overview-period-end" onClick={setToPast}>
          <Icon path={mdiCalendarEnd} className="icon small centering" />
        </button>
        <button className="overview-period-refresh" onClick={refresh}>
          <Icon path={mdiCalendarRefresh} className="icon small centering" />
        </button>
      </div>
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
    dispatch(changeHeatmapTo({ heatmapID: heatmap?._id, isTarget }));
    const cellAddDropdown =
      document.querySelector('.cell-add-dropdown');
    const cell = e.target;
    const rect = cell.getBoundingClientRect();
    cellAddDropdown.style.top = `${window.pageYOffset + rect.y - 21 - (isTarget ? 10 : 0)}px`;
    cellAddDropdown.style.left = `${rect.x + rect.width / 2 - 275 - (isTarget ? 70 : 0)}px`;
    cellAddDropdown.classList.remove('hidden');
  };
  const dateCreation = new Date(project?.date_of_creation ?? dateStart);
  if (min([dateCreation, dateEnd]) === dateEnd) {
    return <> </>;
  }
  let dateNow = max([dateStart, startOfDay(dateCreation)]);
  const gap = differenceInDays(dateNow, dateStart);
  const data = heatmap?.data;
  let dataSorted;
  if (data) {
    dataSorted = [...data];
    dataSorted.sort((a, b) => compareAsc(new Date(a.date), new Date(b.date)));
  }
  const linkify = (str) => str.replace(/\s+/g, '-').toLowerCase();

  const palette = usePaletteGenerator(project.color);

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
        {gap > 0 && <CellDummy length={gap} vertical={false} />}
        {dataSorted &&
          dataSorted.map((point, index) => {
            if (point?.is_target) return <> </>;
            if (differenceInDays(dateEnd, new Date(point.date)) < 0) {
              return <> </>;
            }
            const date = startOfDay(new Date(point.date));
            const dateNowTmp = dateNow;
            const gap = differenceInDays(date, dateNow);
            if (gap < 0) return <> </>;
            dateNow = addDays(date, 1);
            return (
              <>
                {gap > 0 ? (
                  <CellPeriod
                    dateStart={dateNowTmp}
                    dateEnd={subMilliseconds(date, 1)}
                    color={palette[0]}
                    value={0}
                    vertical={false}
                  />
                ) : (
                  <> </>
                )}
                <CellPeriod
                  dateStart={date}
                  dateEnd={endOfDay(date)}
                  color={project.color}
                  value={point.value}
                  basePeriod={24}
                  vertical={false}
                />
              </>
            );
          })}
        {differenceInDays(addDays(dateEnd, 1), dateNow) > 0 && (
          <CellPeriod
            dateStart={dateNow}
            dateEnd={subMilliseconds(addDays(dateEnd, 1), 1)}
            color={palette[0]}
            value={0}
            basePeriod={24}
            vertical={false}
          />
        )}
      </div>
      <div className="overview-project-controls">
        <button
          className="overview-project-button"
          onClick={(e) => openCellAddDropdown(e, false)}
        >
          <Icon path={mdiPlusBox} />
        </button>
        <button
          className="overview-project-button"
          onClick={addCell}
        >
          <Icon path={mdiCheckboxMarked} />
        </button>
        <button
          className="overview-project-button"
          onClick={setStopwatchProject}
        >
          <Icon path={mdiTimer} />
        </button>
        <button
          className="overview-project-button"
          onClick={(e) => openCellAddDropdown(e, true)}
        >
          <Icon path={mdiViewGridPlusOutline} />
        </button>
        <Link
          className="overview-project-button"
          onClick={() => {
            dispatch(changeTo(project._id));
            dispatch(open());
          }}
        >
          <Icon path={mdiPencil} />
        </Link>
        <button
          className="overview-project-button"
          onClick={deleteChosenProject}
        >
          <Icon path={mdiDelete} />
        </button>
      </div>
    </div>
  );
}
