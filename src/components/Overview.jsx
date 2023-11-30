import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@mdi/react';
import {
  mdiMenuLeft,
  mdiMenuUp,
  mdiMenuDown,
  mdiCalendarText,
  mdiCalendarWeekend,
  mdiCog,
} from '@mdi/js';
import { differenceInDays } from 'date-fns';
import { useGetHabitsQuery } from '../state/services/habit';
import { useGetHeatmapsQuery } from '../state/services/heatmap';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../state/services/settings';
import useLoaded from '../hooks/useLoaded';
import useDatePeriod from '../hooks/useDatePeriod';
import { HeatmapMonthsDaily, HeatmapDays } from './HeatmapDateAxes';
import { YearPicker, DatePeriodPicker, DatePeriodControls } from './DatePickers';
import { HabitOverview, HabitAddButton } from './HabitComponents';

export default function Overview() {
  const [loaded] = useLoaded();
  const habits = useGetHabitsQuery();
  const heatmaps = useGetHeatmapsQuery();
  const settings = useGetSettingsQuery();
  const vertical = settings.data.overview_vertical;

  const width =
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  let adaptiveDatePeriodLength;
  if (width < 550) {
    adaptiveDatePeriodLength = Math.floor((width - 30 - 130 - 20 - 28) / 17);
  } else {
    adaptiveDatePeriodLength = Math.floor((width - 85 - 30 - 200 - 115 - 60) / 17);
  }

  const datePeriodLength = Math.min(
    adaptiveDatePeriodLength,
    settings.data?.overview_duration ?? 32,
  );
  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, subPeriod, addPeriod, setToPast, setToFuture, reset },
  ] = useDatePeriod(datePeriodLength);
  const mobile = datePeriodLength <= 14;

  if (!loaded || habits.isLoading || heatmaps.isLoading || settings.isLoading) {
    return <div className="loader" />;
  }

  return (
    <div
      className={`overview-centering ${mobile ? 'mobile' : ''}`}
      style={{
        '--habits': habits.data.length,
        '--length': differenceInDays(dateEnd, dateStart) + 1,
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
          subPeriod={subPeriod}
          addPeriod={addPeriod}
        />
        <OverviewControls vertical={vertical} />
      </div>
      <div className={`overview-container ${vertical ? 'vertical' : ''}`}>
        <div className={`overview ${vertical ? 'vertical' : ''}`}>
          <div className="overview-topbar-left">
            {!vertical && <YearPicker subYear={subYear} addYear={addYear} dateStart={dateStart} />}
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
            {habits.data.map((habit, i) => (
              <HabitOverview
                key={i}
                habit={habit}
                dateStart={dateStart}
                dateEnd={dateEnd}
                heatmap={heatmaps.data.find((heatmapo) => heatmapo.habit._id === habit._id)}
                vertical={vertical}
                mobile={mobile}
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
      <HabitAddButton vertical={vertical} />
    </div>
  );
}

function OverviewControls({ vertical }) {
  const [updateSettings] = useUpdateSettingsMutation();

  return (
    <div className="overview-settings right">
      <button
        className={`overview-open-settings ${vertical ? '' : 'active'}`}
        onClick={() => updateSettings({ values: { overview_vertical: false } })}
        title="Change to horizontal orientation"
      >
        <Icon path={mdiCalendarText} className="icon small centering" />
      </button>
      <button
        className={`overview-open-settings ${vertical ? 'active' : ''}`}
        onClick={() => updateSettings({ values: { overview_vertical: true } })}
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
