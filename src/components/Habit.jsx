import React from 'react';
import { useDispatch } from 'react-redux';
import {
  addHours,
  differenceInWeeks,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { useGetSettingsQuery } from '../state/services/settings';
import { changeTo, open } from '../state/features/habitOverlay/habitOverlaySlice';
import useLoaded from '../hooks/useLoaded';
import useDatePeriod from '../hooks/useDatePeriod';
import { YearPicker, DatePeriodPicker } from './DatePickers';
import Heatmap from './Heatmap';
import { HeatmapMonthsWeekly, HeatmapWeekdays } from './HeatmapDateAxes';
import HabitControls from './HabitComponents';
import useKeyPress from '../hooks/useKeyPress';

export default function Habit({ heatmap, habit }) {
  const [loaded] = useLoaded();
  const settings = useGetSettingsQuery();
  const vertical = true;

  const datePeriodLength = 365;
  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, setToPast, setToFuture, reset },
  ] = useDatePeriod(364);

  useKeyPress(['h'], subMonth);
  useKeyPress(['l'], addMonth);

  const dispatch = useDispatch();
  const openOverlay = () => {
    dispatch(open());
    dispatch(changeTo(''));
  };
  useKeyPress(['a'], openOverlay);

  const diffWeeks = differenceInWeeks(addHours(endOfWeek(dateEnd), 1), startOfWeek(dateStart));

  return (
    <div className="overview-centering" style={{ '--habits': 7 }}>
      <div
        className={`overview-header ${datePeriodLength < 14 ? 'small' : ''}`}
        style={{ '--length': diffWeeks - 21 }}
      >
        <h3>Heatmap</h3>
        <DatePeriodPicker
          dateStart={dateStart}
          setDateStart={setDateStart}
          dateEnd={dateEnd}
          setDateEnd={setDateEnd}
        />
        <HabitControls habit={habit} heatmap={heatmap} header={true} />
      </div>
      <div
        className={`habit-heatmap-container ${vertical ? 'vertical' : ''}`}
        style={{
          '--multiplier': 1,
          '--cell-height': '11px',
          '--cell-width': '11px',
          '--length': diffWeeks,
          '--weeks': diffWeeks - 1,
          '--vertical': vertical * 1,
        }}
      >
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
