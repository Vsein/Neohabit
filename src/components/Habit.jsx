import React from 'react';
import {
  differenceInWeeks,
  startOfWeek,
  endOfWeek,
  compareDesc,
  endOfDay,
} from 'date-fns';
import useLoaded from '../hooks/useLoaded';
import useDatePeriod, { getAdaptivePeriodLength } from '../hooks/useDatePeriod';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { DatePeriodPicker } from './DatePickers';
import Heatmap from './Heatmap';
import { HeatmapMonthsWeekly, HeatmapWeekdays } from './HeatmapDateAxes';
import { HabitControls } from './HabitComponents';
import { generateShades } from '../hooks/usePaletteGenerator';
import { heatmapSort } from '../utils/heatmap';

export default function Habit({
  heatmap,
  habit,
  overridenElimination = undefined,
  overridenNumeric = undefined,
  dateStart,
  dateEnd,
  vertical = true,
}) {
  const dataSorted = heatmapSort(heatmap?.data, dateEnd);
  const targetsSorted = heatmapSort(heatmap?.targets, dateEnd);

  return (
    <div className={`habit-heatmap-container ${vertical ? 'vertical' : ''}`}>
      <div className={`habit-heatmap ${vertical ? 'vertical' : ''}`}>
        {/* <YearPicker subYear={subYear} addYear={addYear} dateStart={dateStart} /> */}
        <HeatmapMonthsWeekly
          dateStart={dateStart}
          diffWeeks={differenceInWeeks(endOfWeek(dateEnd), startOfWeek(dateStart)) + 1}
        />
        <HeatmapWeekdays dateStart={dateStart} dateEnd={dateEnd} />
        <Heatmap
          heatmapID={heatmap?._id}
          heatmap={heatmap}
          heatmapData={dataSorted}
          heatmapTargets={targetsSorted}
          habit={habit}
          dateStart={dateStart}
          dateEnd={dateEnd}
          vertical={vertical}
          isOverview={false}
          overridenElimination={overridenElimination}
          overridenNumeric={overridenNumeric}
        />
      </div>
    </div>
  );
}

function HabitDefaultWrapper({
  heatmap,
  habit,
  onboardingSlide = 0,
  modal = false,
  habitPage = false,
  dateStart,
  dateEnd,
  mobile = false,
}) {
  const [loaded] = useLoaded();
  const vertical = true;

  const diffWeeks = differenceInWeeks(endOfWeek(dateEnd), startOfWeek(dateStart)) + 1;

  const { colorShade, calmColorShade, textColor, calmTextColor } = generateShades(habit.color);

  return (
    <div
      className={`overview-centering slide-${onboardingSlide}`}
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
        '--datepicker-text-color': textColor,
        '--datepicker-calm-text-color': calmTextColor,
        margin: 'auto',
      }}
    >
      <div
        className={`overview-header ${mobile ? 'small' : ''} ${
          modal ? 'modal-mode' : ''
        } singular habit-mode`}
      >
        <h3 style={{ color: colorShade, textAlign: 'center' }}>{habit?.name}</h3>
        <HabitControls
          habit={habit}
          heatmapID={heatmap?._id}
          header={true}
          modal={modal}
          habitPage={habitPage}
        />
      </div>
      <Habit
        heatmap={heatmap}
        habit={habit}
        habitPage={true}
        dateStart={dateStart}
        dateEnd={dateEnd}
        mobile={mobile}
        vertical={vertical}
      />
    </div>
  );
}

function HabitModalWrapper({
  heatmap,
  habit,
  onboardingSlide = 0,
  overridenElimination = undefined,
  overridenNumeric = undefined,
  habitPage = false,
}) {
  const [loaded] = useLoaded();
  const vertical = true;

  const { width } = useWindowDimensions();
  const { adaptiveDatePeriodLength, mobile } = getAdaptivePeriodLength(width, true);
  const datePeriodLength = Math.min(35, adaptiveDatePeriodLength - !!onboardingSlide * 2);
  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { setToPast, setToFuture, reset, addPeriod, subPeriod, isPastPeriod, isFuturePeriod },
  ] = useDatePeriod(datePeriodLength, false, true, true);

  const diffWeeks = differenceInWeeks(endOfWeek(dateEnd), startOfWeek(dateStart)) + 1;

  const { colorShade, calmColorShade, textColor, calmTextColor } = generateShades(habit.color);

  return (
    <div
      className={`overview-centering slide-${onboardingSlide}`}
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
        '--datepicker-text-color': textColor,
        '--datepicker-calm-text-color': calmTextColor,
        margin: 'auto',
      }}
    >
      <div className={`overview-header ${mobile ? 'small' : ''} modal-mode singular habit-mode`}>
        <DatePeriodPicker
          dateStart={dateStart}
          setDateStart={setDateStart}
          dateEnd={dateEnd}
          setDateEnd={setDateEnd}
          subPeriod={subPeriod}
          addPeriod={addPeriod}
          setToPast={setToPast}
          reset={reset}
          setToFuture={setToFuture}
          mobile={mobile}
          isPastPeriod={isPastPeriod}
          isFuturePeriod={isFuturePeriod}
        />
        <HabitControls
          habit={habit}
          heatmapID={heatmap?._id}
          header={true}
          modal={true}
          habitPage={habitPage}
        />
      </div>
      <Habit
        heatmap={heatmap}
        habit={habit}
        modal={true}
        overridenElimination={overridenElimination}
        overridenNumeric={overridenNumeric}
        dateStart={dateStart}
        dateEnd={dateEnd}
        mobile={mobile}
      />
    </div>
  );
}

export { HabitDefaultWrapper, HabitModalWrapper };
