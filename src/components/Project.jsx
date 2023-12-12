import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Icon } from '@mdi/react';
import { mdiMenuLeft, mdiMenuUp, mdiMenuDown, mdiPencil, mdiDelete } from '@mdi/js';
import { differenceInDays } from 'date-fns';
import { useGetHabitsQuery } from '../state/services/habit';
import { useGetHeatmapsQuery } from '../state/services/heatmap';
import { useGetSettingsQuery } from '../state/services/settings';
import { useDeleteProjectMutation } from '../state/services/project';
import { changeTo } from '../state/features/overlay/overlaySlice';
import useDatePeriod from '../hooks/useDatePeriod';
import { HeatmapMonthsDaily, HeatmapDays } from './HeatmapDateAxes';
import { YearPicker, DatePeriodPicker, DatePeriodControls } from './DatePickers';
import { HabitOverview, HabitAddButton } from './HabitComponents';
import { mixColors, hexToRgb } from '../hooks/usePaletteGenerator';

export default function Project({
  project,
  datePeriodLength,
  mobile,
  singular = false,
  globalDateStart = null,
  globalDateEnd = null,
}) {
  const heatmaps = useGetHeatmapsQuery();
  const habits = useGetHabitsQuery();
  const settings = useGetSettingsQuery();
  const vertical = false;
  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, subPeriod, addPeriod, setToPast, setToFuture, reset },
  ] = useDatePeriod(datePeriodLength);

  useEffect(() => {
    if (globalDateStart && globalDateEnd) {
      setDateStart(globalDateStart);
      setDateEnd(globalDateEnd);
    }
  }, [globalDateStart, globalDateEnd]);

  const colorShade = !settings.data?.prefer_dark
    ? mixColors({ r: 0, g: 0, b: 0 }, hexToRgb(project.color), 0.8)
    : mixColors({ r: 255, g: 255, b: 255 }, hexToRgb(project.color), 0.6);

  return (
    !heatmaps.isFetching &&
    !habits.isFetching &&
    !settings.isFetching && (
      <div
        className={`overview-centering ${mobile ? 'mobile' : ''}`}
        style={{
          '--habits': project.habits.length,
          '--length': differenceInDays(dateEnd, dateStart) + 1,
          '--vertical': vertical * 1,
          // '--multiplier': settings.data.cell_height_multiplier,
          '--multiplier': 1,
          '--cell-height': '15px',
          '--cell-width': '15px',
          [project.color !== '#8a8a8a' ? '--signature-color' : '']: colorShade,
          [project.color !== '#8a8a8a' ? '--bright-signature-color' : '']: colorShade,
          [project.color !== '#8a8a8a' ? '--calm-signature-color' : '']: `${colorShade}55`,
        }}
      >
        <div
          className={`overview-header ${vertical ? 'vertical' : ''} ${
            mobile ? 'small' : ''
          } ${singular ? 'singular' : ''}`}
        >
          <NavLink to={`../project/${project?._id}`} title={project.name}>
            <h3 style={{ color: colorShade, textAlign: 'center' }}>{project?.name}</h3>
          </NavLink>
          {(!mobile || singular) && (
            <DatePeriodPicker
              dateStart={dateStart}
              setDateStart={setDateStart}
              dateEnd={dateEnd}
              setDateEnd={setDateEnd}
              subPeriod={subPeriod}
              addPeriod={addPeriod}
            />
          )}
          <ProjectControls projectID={project?._id} />
        </div>
        <div className={`overview-container ${vertical ? 'vertical' : ''}`}>
          <div className={`overview ${vertical ? 'vertical' : ''}`}>
            <div className="overview-topbar-left">
              {!vertical && (
                <YearPicker subYear={subYear} addYear={addYear} dateStart={dateStart} />
              )}
              <button className="centering" onClick={subMonth} title="Move month to the left [H]">
                <Icon path={vertical ? mdiMenuUp : mdiMenuLeft} className="icon" />
              </button>
            </div>
            <HeatmapMonthsDaily dateStart={dateStart} dateEnd={dateEnd} />
            <HeatmapDays dateStart={dateStart} dateEnd={dateEnd} />
            <DatePeriodControls
              vertical={vertical}
              dateStart={dateStart}
              subYear={subYear}
              addYear={addYear}
              addMonth={addMonth}
              setToPast={setToPast}
              reset={reset}
              setToFuture={setToFuture}
            />
            <div className="overview-habits">
              {project.habits &&
                project.habits.map((habit, i) =>
                  habit?._id ? (
                    <HabitOverview
                      key={i}
                      habit={habit}
                      dateStart={dateStart}
                      dateEnd={dateEnd}
                      heatmap={heatmaps.data.find((heatmapo) => heatmapo.habit._id === habit._id)}
                      vertical={vertical}
                      mobile={mobile}
                      projectID={project._id}
                    />
                  ) : (
                    habits.data.find((habito) => habito._id === habit) && (
                      <HabitOverview
                        key={i}
                        habit={habits.data.find((habito) => habito._id === habit)}
                        dateStart={dateStart}
                        dateEnd={dateEnd}
                        heatmap={heatmaps.data.find((heatmapo) => heatmapo.habit._id === habit)}
                        vertical={vertical}
                        mobile={mobile}
                        projectID={project._id}
                      />
                    )
                  ),
                )}
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
        <HabitAddButton vertical={vertical} projectID={project._id} />
      </div>
    )
  );
}

function ProjectControls({ projectID }) {
  const dispatch = useDispatch();
  const openOverlay = () => {
    dispatch(changeTo({ projectID, type: 'project' }));
  };

  const [deleteProject] = useDeleteProjectMutation();
  const deleteChosenProject = () => {
    deleteProject(projectID);
  };

  return (
    projectID !== 'default' && (
      <div className="overview-settings right">
        <button
          className="overview-open-settings active"
          onClick={openOverlay}
          title="Edit the project"
        >
          <Icon path={mdiPencil} className="icon small centering" />
        </button>
        <button
          className="overview-open-settings active"
          onClick={deleteChosenProject}
          title="Delete the project"
        >
          <Icon path={mdiDelete} className="icon small centering" />
        </button>
      </div>
    )
  );
}
