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
    minus += 200 + 120;
  }
  const adaptiveDatePeriodLength = Math.floor((width - minus) / 19);
  return { adaptiveDatePeriodLength, mobile: width < 850 };
}

export default function useDatePeriod(periodDuration, global = false, weekly = false) {
  const settings = useGetSettingsQuery();
  const { width } = useWindowDimensions();
  const state = settings.data.overview_current_day;
  const offset = settings.data.overview_offset ?? 0;

  const getStart = () => {
    const curDate = startOfDay(new Date());
    if (weekly) {
      if (state === 'start') return startOfWeek(addDays(curDate, -offset));
      if (state === 'end')
        return startOfWeek(addDays(curDate, (-periodDuration + 1) * 7 + offset + 1));
      return startOfWeek(addDays(curDate, -Math.floor(periodDuration / 2) * 7 + offset));
    }
    if (state === 'start') return addDays(curDate, -offset);
    if (state === 'end') return addDays(curDate, -periodDuration + offset + 1);
    return addDays(curDate, -Math.floor(periodDuration / 2) + offset);
  };

  const getEnd = () => {
    const curDate = startOfDay(new Date());
    if (weekly) {
      if (state === 'start')
        return startOfDay(endOfWeek(addDays(curDate, periodDuration * 7 - offset - 1)));
      if (state === 'end') return startOfDay(endOfWeek(addDays(curDate, offset)));
      return startOfDay(
        endOfWeek(
          addDays(
            curDate,
            Math.floor(periodDuration / 2 - 1) * 7 + offset - 1 + (periodDuration % 2) * 7,
          ),
        ),
      );
    }
    if (state === 'start') return addDays(curDate, periodDuration - offset - 1);
    if (state === 'end') return addDays(curDate, offset);
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
    const tmpStart = startOfDay(new Date());
    setDateEnd(addDays(tmpStart, offset));
    setDateStart(addDays(tmpStart, -periodDuration + offset + 1));
  };

  const setToFuture = () => {
    const tmpStart = startOfDay(new Date());
    setDateStart(addDays(tmpStart, -offset));
    setDateEnd(addDays(tmpStart, periodDuration - offset - 1));
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

  return [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, subPeriod, addPeriod, setToPast, setToFuture, reset },
  ];
}

export { getAdaptivePeriodLength };
