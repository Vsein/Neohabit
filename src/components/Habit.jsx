import React from 'react';
import { differenceInWeeks, startOfWeek, endOfWeek } from 'date-fns';
import { useGetSettingsQuery } from '../state/services/settings';
import useLoaded from '../hooks/useLoaded';
import useDatePeriod, { getAdaptivePeriodLength } from '../hooks/useDatePeriod';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { YearPicker, DatePeriodPicker } from './DatePickers';
import Heatmap from './Heatmap';
import { HeatmapMonthsWeekly, HeatmapWeekdays } from './HeatmapDateAxes';
import { HabitControls } from './HabitComponents';
import { mixColors, hexToRgb } from '../hooks/usePaletteGenerator';

export default function Habit({ heatmap, habit }) {
  const [loaded] = useLoaded();
  const settings = useGetSettingsQuery();
  // const settings = useGetSettingsQuery();
  const vertical = true;
  const { width } = useWindowDimensions();
  const { adaptiveDatePeriodLength, mobile } = getAdaptivePeriodLength(width, true);

  const datePeriodLength = adaptiveDatePeriodLength < 53 ? adaptiveDatePeriodLength : 365;
  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, setToPast, setToFuture, reset, addPeriod, subPeriod },
  ] = useDatePeriod(datePeriodLength, false, datePeriodLength !== 365);

  const diffWeeks = differenceInWeeks(endOfWeek(dateEnd), startOfWeek(dateStart)) + 1;

  const colorShade = !settings.data?.prefer_dark
    ? mixColors({ r: 0, g: 0, b: 0 }, hexToRgb(habit.color), 0.8)
    : mixColors({ r: 255, g: 255, b: 255 }, hexToRgb(habit.color), 0.6);

  return (
    <div
      className="overview-centering"
      style={{
        '--habits': 7,
        '--length': diffWeeks - 14.5,
        '--multiplier': 1,
        '--cell-height': '15px',
        '--cell-width': '15px',
        '--weeks': diffWeeks,
        '--vertical': vertical * 1,
        '--signature-color': colorShade,
        '--bright-signature-color': colorShade,
        '--calm-signature-color': `${colorShade}55`,
      }}
    >
      <div className={`overview-header ${mobile ? 'small' : ''} singular habit-mode`}>
        <h3 style={{ color: colorShade, textAlign: 'center' }}>{habit?.name}</h3>
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
          {/* <YearPicker subYear={subYear} addYear={addYear} dateStart={dateStart} /> */}
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
