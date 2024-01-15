import React from 'react';
import { differenceInWeeks, startOfWeek, endOfWeek } from 'date-fns';
import { useGetSettingsQuery } from '../state/services/settings';
import useLoaded from '../hooks/useLoaded';
import useDatePeriod, { getAdaptivePeriodLength } from '../hooks/useDatePeriod';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { DatePeriodPicker } from './DatePickers';
import Heatmap from './Heatmap';
import { HeatmapMonthsWeekly, HeatmapWeekdays } from './HeatmapDateAxes';
import { HabitControls, ReturnButton } from './HabitComponents';
import { mixColors, hexToRgb, getNumericTextColor } from '../hooks/usePaletteGenerator';

export default function Habit({
  heatmap,
  habit,
  onboardingSlide = 0,
  modal = false,
  overridenElimination = undefined,
  overridenNumeric = undefined,
}) {
  const [loaded] = useLoaded();
  const settings = useGetSettingsQuery();
  // const settings = useGetSettingsQuery();
  const vertical = true;
  const { width } = useWindowDimensions();
  const { adaptiveDatePeriodLength, mobile } = getAdaptivePeriodLength(width, true);

  const datePeriodLength =
    adaptiveDatePeriodLength < 53 ? (modal ? 250 : adaptiveDatePeriodLength - !!onboardingSlide) : modal ? 250 : 365;
  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, setToPast, setToFuture, reset, addPeriod, subPeriod },
  ] = useDatePeriod(datePeriodLength, false, datePeriodLength !== 365 && !modal);

  const diffWeeks = differenceInWeeks(endOfWeek(dateEnd), startOfWeek(dateStart)) + 1;

  const colorShade = !settings.data?.prefer_dark
    ? mixColors({ r: 0, g: 0, b: 0 }, hexToRgb(habit.color), 0.8)
    : mixColors({ r: 255, g: 255, b: 255 }, hexToRgb(habit.color), 0.6);
  const calmColorShade = !settings.data?.prefer_dark
    ? mixColors({ r: 255, g: 255, b: 255 }, hexToRgb(colorShade), 0.33)
    : mixColors({ r: 45, g: 51, b: 51 }, hexToRgb(colorShade), 0.33);

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
        '--datepicker-text-color': getNumericTextColor(colorShade),
        '--datepicker-calm-text-color': getNumericTextColor(calmColorShade),
        margin: 'auto',
      }}
    >
      <div
        className={`overview-header ${mobile ? 'small' : ''} ${
          modal ? 'modal-mode' : ''
        } singular habit-mode`}
      >
        {!modal && !onboardingSlide && (
          <div className="overview-header-return-mode">
            <ReturnButton />
            <h3 style={{ color: colorShade, textAlign: 'center' }}>{habit?.name}</h3>
          </div>
        )}
        {!!onboardingSlide &&
          <h3 style={{ color: colorShade, textAlign: 'center' }}>{habit?.name}</h3>
        }
        <DatePeriodPicker
          dateStart={dateStart}
          setDateStart={setDateStart}
          dateEnd={dateEnd}
          setDateEnd={setDateEnd}
          addPeriod={addPeriod}
          subPeriod={subPeriod}
          setToPast={setToPast}
          reset={reset}
          setToFuture={setToFuture}
        />
        <HabitControls habit={habit} heatmap={heatmap} header={true} modal={modal} />
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
            overridenElimination={overridenElimination}
            overridenNumeric={overridenNumeric}
          />
        </div>
      </div>
    </div>
  );
}
