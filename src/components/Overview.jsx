import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@mdi/react';
import {
  mdiMenuDown,
  mdiCalendarText,
  mdiCalendarWeekend,
  mdiCog,
} from '@mdi/js';
import { differenceInDays } from 'date-fns';
import { useGetHabitsQuery } from '../state/services/habit';
import { useGetHeatmapsQuery } from '../state/services/heatmap';
import { useUpdateSettingsMutation } from '../state/services/settings';
import useLoaded from '../hooks/useLoaded';
import { HeatmapMonthsDaily, HeatmapDays } from './HeatmapDateAxes';
import { YearPicker, OverviewTopbarRight, NextPeriodButton, PreviousPeriodButton } from './DatePickers';
import { HabitOverview, HabitAddButton } from './HabitComponents';
import { heatmapSort, isHabitArchived } from '../utils/heatmap';

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
  const vertical = false;

  if (!loaded || habits.isLoading || heatmaps.isLoading) {
    return <div className="loader" />;
  }

  const Habits = habits.data.flatMap((habit, i) => {
    const heatmap = heatmaps.data.find((heatmapo) => heatmapo.habit._id === habit._id);
    const dataSorted = heatmapSort(heatmap?.data, dateEnd);
    const targetsSorted = heatmapSort(heatmap?.targets, dateEnd);

    return isHabitArchived(targetsSorted, dateStart, dateEnd) ? (
      []
    ) : (
      <HabitOverview
        key={i}
        habit={habit}
        dateStart={dateStart}
        dateEnd={dateEnd}
        heatmap={heatmap}
        heatmapData={dataSorted}
        heatmapTargets={targetsSorted}
        heatmapID={heatmap?._id}
        vertical={vertical}
        mobile={mobile}
      />
    );
  });

  return (
    <div
      className={`overview-centering ${mobile ? 'mobile' : ''}`}
      style={{
        '--habits': Habits.length,
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
        {mobile ? (
          <h3>Overview</h3>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 20px', gridArea: 'name' }}>
            <h3>Overview</h3>
            <PreviousPeriodButton onClick={subPeriod} alignRight vertical={vertical} style={{ transform: 'translateX(-4px)' }} />
          </div>
        )}
        {!mobile && (
          <>
            <HeatmapMonthsDaily dateStart={dateStart} dateEnd={dateEnd} />
            <HeatmapDays dateStart={dateStart} dateEnd={dateEnd} />
          </>
        )}
        <OverviewControls vertical={vertical} mobile={mobile} addPeriod={addPeriod} />
      </div>
      <div className={`overview-container ${vertical ? 'vertical' : ''} ${mobile ? 'mobile' : ''}`}>
        <div className={`overview ${vertical ? 'vertical' : ''} ${mobile ? 'mobile' : ''}`}>
          {mobile && (
            <>
              <div className="overview-topbar-left">
                {/* {!vertical && ( */}
                {/*   <YearPicker subYear={subYear} addYear={addYear} dateStart={dateStart} /> */}
                {/* )} */}
                <PreviousPeriodButton onClick={subPeriod} alignRight vertical={vertical} />
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
            {Habits}
          </div>
          {vertical && (
            <button
              className="overview-period-move-down"
              onClick={addPeriod}
              title="Next Period [L]"
            >
              <Icon path={mdiMenuDown} className="icon" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function OverviewControls({ vertical, mobile, addPeriod }) {
  // const [updateSettings] = useUpdateSettingsMutation();

  return (
    <div className="overview-settings">
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
      {!mobile && (
        <NextPeriodButton onClick={addPeriod} alignLeft style={{ transform: 'translateX(-6px)' }}
        />
      )}
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
