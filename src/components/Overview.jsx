import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@mdi/react';
import { mdiMenuLeft, mdiMenuUp, mdiMenuDown, mdiCog } from '@mdi/js';
import { differenceInDays } from 'date-fns';
import { useGetHabitsQuery } from '../state/services/habit';
import { useGetHeatmapsQuery } from '../state/services/heatmap';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../state/services/settings';
import useLoaded from '../hooks/useLoaded';
import { HeatmapMonthsDaily, HeatmapDays } from './HeatmapDateAxes';
import { YearPicker, OverviewTopbarRight } from './DatePickers';
import { HabitOverview, HabitAddButton } from './HabitComponents';

export default function Overview({
  dateStart,
  dateEnd,
  mobile,
  addPeriod,
  subPeriod,
  addYear,
  subYear,
}) {
  const [loaded] = useLoaded();
  const habits = useGetHabitsQuery();
  const heatmaps = useGetHeatmapsQuery();
  const settings = useGetSettingsQuery();
  const vertical = settings.data.overview_vertical;

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
          mobile ? 'small' : ''
        } singular`}
      >
        <h3>Overview</h3>
        {!mobile && (
          <>
            <HeatmapMonthsDaily dateStart={dateStart} dateEnd={dateEnd} />
            <HeatmapDays dateStart={dateStart} dateEnd={dateEnd} />
          </>
        )}
        <OverviewControls vertical={vertical} />
      </div>
      <div className={`overview-container ${vertical ? 'vertical' : ''} ${mobile ? 'mobile' : ''}`}>
        <div className={`overview ${vertical ? 'vertical' : ''} ${mobile ? 'mobile' : ''}`}>
          {mobile && (
            <>
              <div className="overview-topbar-left">
                {/* {!vertical && ( */}
                {/*   <YearPicker subYear={subYear} addYear={addYear} dateStart={dateStart} /> */}
                {/* )} */}
                <button
                  className="centering right"
                  onClick={subPeriod}
                  title="Move month to the left [H]"
                >
                  <Icon path={vertical ? mdiMenuUp : mdiMenuLeft} className="icon" />
                </button>
              </div>
              <HeatmapMonthsDaily dateStart={dateStart} dateEnd={dateEnd} />
              <HeatmapDays dateStart={dateStart} dateEnd={dateEnd} />
              <OverviewTopbarRight
                vertical={vertical}
                dateStart={dateStart}
                subYear={subYear}
                addYear={addYear}
                addMonth={addPeriod}
              />
            </>
          )}
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
              onClick={addPeriod}
              title="Move month to the right [L]"
            >
              <Icon path={mdiMenuDown} className="icon" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function OverviewControls({ vertical }) {
  const [updateSettings] = useUpdateSettingsMutation();

  return (
    <div className="overview-settings right">
      {/* <button */}
      {/*   className={`overview-open-settings ${vertical ? '' : 'active'}`} */}
      {/*   onClick={() => updateSettings({ values: { overview_vertical: false } })} */}
      {/*   title="Change to horizontal orientation" */}
      {/* > */}
      {/*   <Icon path={mdiCalendarText} className="icon small centering" /> */}
      {/* </button> */}
      {/* <button */}
      {/*   className={`overview-open-settings ${vertical ? 'active' : ''}`} */}
      {/*   onClick={() => updateSettings({ values: { overview_vertical: true } })} */}
      {/*   title="Change to vertical orientation" */}
      {/* > */}
      {/*   <Icon path={mdiCalendarWeekend} className="icon small centering" /> */}
      {/* </button> */}
      <HabitAddButton />
      <NavLink
        className="overview-open-settings"
        to="/settings#heatmaps"
        title="Open overview settings"
      >
        <Icon path={mdiCog} className="icon small centering" />
      </NavLink>
    </div>
  );
}
