import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  mdiPencil,
} from '@mdi/js';
import { differenceInDays } from 'date-fns';
import { useGetHabitsQuery } from '../state/services/habit';
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
import { HabitControls, HabitAddButton } from './HabitComponents';
import useKeyPress from '../hooks/useKeyPress';
import { mixColors, hexToRgb } from '../hooks/usePaletteGenerator';

export default function Project({ project }) {
  const { theme } = useSelector((state) => state.theme);
  const heatmaps = useGetHeatmapsQuery();
  const habits = useGetHabitsQuery();
  const vertical = false;
  const datePeriodLength = 46;
  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, subPeriod, addPeriod, setToPast, setToFuture, reset },
  ] = useDatePeriod(datePeriodLength - 1);
  useKeyPress(['h'], subMonth);
  useKeyPress(['l'], addMonth);

  const colorShade = mixColors(
    theme === 'light' ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 },
    hexToRgb(project.color),
    theme === 'light' ? 0.7 : 0.5,
  );

  return (
    !heatmaps.isFetching &&
    !habits.isFetching && (
      <div
        className="overview-centering"
        style={{
          '--habits': project.habits.length,
          '--length': differenceInDays(dateEnd, dateStart) + 1,
          '--vertical': vertical * 1,
          // '--multiplier': settings.data.cell_height_multiplier,
          '--multiplier': 1,
          '--cell-height': '15px',
          '--cell-width': '15px',
          '--signature-color': colorShade,
          '--bright-signature-color': colorShade,
        }}
      >
        <div
          className={`overview-header ${vertical ? 'vertical' : ''} ${
            datePeriodLength < 14 ? 'small' : ''
          }`}
        >
          <h3 style={{ color: colorShade }}>{project?.name}</h3>
          <DatePeriodPicker
            dateStart={dateStart}
            setDateStart={setDateStart}
            dateEnd={dateEnd}
            setDateEnd={setDateEnd}
            subPeriod={subPeriod}
            addPeriod={addPeriod}
          />
          <OverviewSettings projectID={project?._id} />
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
            <div className="overview-habits">
              {project.habits &&
                project.habits.map((habit, i) =>
                  habit?._id ? (
                    <OverviewHabit
                      key={i}
                      habit={habit}
                      dateStart={dateStart}
                      dateEnd={dateEnd}
                      heatmap={heatmaps.data.find((heatmapo) => heatmapo.habit._id === habit._id)}
                      vertical={vertical}
                    />
                  ) : (
                    habits.data.find((habito) => habito._id === habit) && (
                      <OverviewHabit
                        key={i}
                        habit={habits.data.find((habito) => habito._id === habit)}
                        dateStart={dateStart}
                        dateEnd={dateEnd}
                        heatmap={heatmaps.data.find((heatmapo) => heatmapo.habit._id === habit)}
                        vertical={vertical}
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
        <HabitAddButton vertical={vertical} />
      </div>
    )
  );
}

function OverviewHabit({ dateStart, dateEnd, habit, heatmap, vertical }) {
  const linkify = (str) => str.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="overview-habit">
      <NavLink
        className="overview-habit-name"
        to={`../habit/${linkify(habit._id)}`}
        title={habit.name}
      >
        {habit.name}
      </NavLink>
      <Heatmap
        heatmap={heatmap}
        habit={habit}
        dateStart={dateStart}
        dateEnd={dateEnd}
        vertical={vertical}
        isOverview={true}
      />
      <HabitControls habit={habit} heatmap={heatmap} />
    </div>
  );
}

function OverviewSettings({ projectID }) {
  const dispatch = useDispatch();
  const openOverlay = () => {
    dispatch(open());
    dispatch(changeTo(projectID));
  };

  return (
    <div className="overview-settings">
      <button
        className="overview-open-settings active"
        onClick={openOverlay}
        title="Change to horizontal orientation"
      >
        <Icon path={mdiPencil} className="icon small centering" />
      </button>
    </div>
  );
}
