import React from 'react';
import { addHours, differenceInWeeks, startOfWeek, endOfWeek } from 'date-fns';
// import { useGetSettingsQuery } from '../state/services/settings';
import useLoaded from '../hooks/useLoaded';
import useDatePeriod from '../hooks/useDatePeriod';
import { YearPicker, DatePeriodPicker } from './DatePickers';
import Heatmap from './Heatmap';
import { HeatmapMonthsWeekly, HeatmapWeekdays } from './HeatmapDateAxes';
import { HabitControls } from './HabitComponents';

export default function Habit({ heatmap, habit }) {
  const [loaded] = useLoaded();
  // const settings = useGetSettingsQuery();
  const vertical = true;

  const datePeriodLength = 365;
  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, setToPast, setToFuture, reset, addPeriod, subPeriod },
  ] = useDatePeriod(datePeriodLength);

  const diffWeeks = differenceInWeeks(addHours(endOfWeek(dateEnd), 1), startOfWeek(dateStart));

  return (
    <div
      className="overview-centering"
      style={{
        '--habits': 7,
        '--length': diffWeeks - 11,
        '--multiplier': 1,
        '--cell-height': '15px',
        '--cell-width': '15px',
        '--weeks': diffWeeks,
        '--vertical': vertical * 1,
      }}
    >
      <div className={`overview-header ${datePeriodLength < 14 ? 'small' : ''}`}>
        <h3>Heatmap</h3>
        <DatePeriodPicker
          dateStart={dateStart}
          setDateStart={setDateStart}
          dateEnd={dateEnd}
          setDateEnd={setDateEnd}
          addPeriod={addPeriod}
          subPeriod={subPeriod}
        />
        <HabitControls habit={habit} heatmap={heatmap} header={true} />
      </div>
      <div className={`habit-heatmap-container ${vertical ? 'vertical' : ''}`}>
        <div className={`habit-heatmap ${vertical ? 'vertical' : ''}`}>
          <YearPicker subYear={subYear} addYear={addYear} dateStart={dateStart} />
          <HeatmapMonthsWeekly dateStart={dateStart} dateEnd={dateEnd} />
          <HeatmapWeekdays dateStart={dateStart} dateEnd={dateEnd} />
          <Heatmap
            heatmap={heatmap}
            habit={habit}
            dateStart={dateStart}
            dateEnd={dateEnd}
            vertical={vertical}
            isOverview={false}
          />
        </div>
      </div>
    </div>
  );
}
