import { useState, useEffect } from 'react';
import {
  startOfDay,
  isFirstDayOfMonth,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  subMonths,
  addMonths,
  subYears,
  addYears,
  addDays,
  differenceInDays,
  formatISO,
} from 'date-fns';
import { useGetSettingsQuery } from '../state/services/settings';
import useKeyPress from './useKeyPress';
import useWindowDimensions from './useWindowDimensions';

function getAdaptivePeriodLength(width, habit = false) {
  let minus = 0;
  if (width < 550) {
    // minus += 10;
  } else if (width < 1000) {
    minus += 30 + 85; // padding + sidebar
  } else {
    minus += 40 + 85; // padding + sidebar
  }
  if (habit) {
    return {
      adaptiveDatePeriodLength: Math.floor((width - minus - 40 - 10) / 19),
      mobile: width < 850,
    };
  }
  if (width < 850) {
    minus += 110 + 20 + 5;
  } else if (width < 1000) {
    minus += 200 + 120 + 10;
  } else {
    minus += 200 + 120 + 3;
  }
  const adaptiveDatePeriodLength = Math.floor((width - minus) / 19);
  return { adaptiveDatePeriodLength, mobile: width < 850 };
}

function useGetDatePeriodLength() {
  const settings = useGetSettingsQuery();

  const { width } = useWindowDimensions();
  const { adaptiveDatePeriodLength, mobile } = getAdaptivePeriodLength(width);
  const datePeriodLength =
    settings.data?.overview_adaptive ?? true
      ? Math.min(
          adaptiveDatePeriodLength,
          settings.data?.overview_apply_limit ?? true
            ? settings.data?.overview_duration_limit ?? 32
            : Infinity,
        )
      : settings.data?.overview_duration ?? 32;

  return { datePeriodLength, mobile, width };
}

export default function useDatePeriod(periodDuration, global = false, weekly = false) {
  const settings = useGetSettingsQuery();
  const { width } = useWindowDimensions();
  const state =
    !weekly || !settings.data.habit_heatmaps_override
      ? settings.data.overview_current_day
      : settings.data.habit_heatmaps_current_day;
  const offset = settings.data.overview_offset ?? 0;

  const getStart = (neededState = state) => {
    const curDate = startOfDay(new Date());
    if (weekly) {
      if (neededState === 'start') return startOfWeek(addDays(curDate, -offset));
      if (neededState === 'end')
        return startOfWeek(addDays(curDate, (-periodDuration + 1) * 7 + offset + 1));
      return startOfWeek(addDays(curDate, -Math.floor(periodDuration / 2) * 7 + offset));
    }
    if (neededState === 'start') return addDays(curDate, -offset);
    if (neededState === 'end') return addDays(curDate, -periodDuration + offset + 1);
    return addDays(curDate, -Math.floor(periodDuration / 2) + offset);
  };

  const getEnd = (neededState = state) => {
    const curDate = startOfDay(new Date());
    if (weekly) {
      if (neededState === 'start')
        return startOfDay(endOfWeek(addDays(curDate, (periodDuration - 1) * 7 - offset - 1)));
      if (neededState === 'end') return startOfDay(endOfWeek(addDays(curDate, offset)));
      return startOfDay(
        endOfWeek(
          addDays(
            curDate,
            Math.floor(periodDuration / 2 - 1) * 7 + offset - 1 + (periodDuration % 2) * 7,
          ),
        ),
      );
    }
    if (neededState === 'start') return addDays(curDate, periodDuration - offset - 1);
    if (neededState === 'end') return addDays(curDate, offset);
    return addDays(curDate, Math.floor(periodDuration / 2) + offset - 1 + (periodDuration % 2));
  };

  const [dateStart, setDateStart] = useState(getStart());
  const [dateEnd, setDateEnd] = useState(getEnd());

  const subMonth = () => {
    const tmpStart = startOfMonth(
      isFirstDayOfMonth(dateStart) ? subMonths(dateStart, 1) : dateStart,
    );
    setDateStart(tmpStart);
    setDateEnd(addDays(tmpStart, periodDuration - 1));
  };

  const addMonth = () => {
    const tmpStart = startOfMonth(addMonths(dateStart, 1));
    setDateStart(tmpStart);
    setDateEnd(addDays(tmpStart, periodDuration - 1));
  };

  const subYear = () => {
    setDateStart(subYears(dateStart, 1));
    setDateEnd(subYears(dateEnd, 1));
  };

  const addYear = () => {
    setDateStart(addYears(dateStart, 1));
    setDateEnd(addYears(dateEnd, 1));
  };

  const subPeriod = () => {
    const period = differenceInDays(dateEnd, dateStart) + 1;
    setDateStart(addDays(dateStart, -period));
    setDateEnd(addDays(dateEnd, -period));
  };

  const addPeriod = () => {
    const period = differenceInDays(dateEnd, dateStart) + 1;
    setDateStart(addDays(dateStart, period));
    setDateEnd(addDays(dateEnd, period));
  };

  const setToPast = () => {
    setDateEnd(getEnd('end'));
    setDateStart(getStart('end'));
  };

  const setToFuture = () => {
    setDateStart(getStart('start'));
    setDateEnd(getEnd('start'));
  };

  const reset = () => {
    setDateStart(getStart());
    setDateEnd(getEnd());
  };

  if (!global) {
    useKeyPress(['r'], reset);
    useKeyPress(['H'], subMonth);
    useKeyPress(['L'], addMonth);
    useKeyPress(['h'], subPeriod);
    useKeyPress(['l'], addPeriod);
  }

  useEffect(() => {
    reset();
  }, [width]);

  useEffect(() => {
    const diff = differenceInDays(dateEnd, dateStart) + 1;
    if (diff > periodDuration && width >= 850 && !weekly) {
      document.documentElement.classList.add('overflow-visible');
    } else {
      document.documentElement.classList.remove('overflow-visible');
    }
  }, [dateEnd, dateStart]);

  return [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, subPeriod, addPeriod, setToPast, setToFuture, reset },
  ];
}

function getUTCOffsettedDate(date = new Date()) {
  return formatISO(addDays(date, new Date().getTimezoneOffset() > 0 * 1), {
    representation: 'date',
  });
}

export { getAdaptivePeriodLength, useGetDatePeriodLength, getUTCOffsettedDate };
