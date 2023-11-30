import { useState, useEffect } from 'react';
import {
  startOfDay,
  isFirstDayOfMonth,
  startOfMonth,
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

function getAdaptivePeriodLength(width) {
  let adaptiveDatePeriodLength;
  if (width < 550) {
    adaptiveDatePeriodLength = Math.floor((width - 30 - 130 - 20 - 20) / 19);
  } else if (width < 850) {
    adaptiveDatePeriodLength = Math.floor((width - 85 - 30 - 130 - 20 - 5) / 19);
  } else if (width < 1000) {
    adaptiveDatePeriodLength = Math.floor((width - 85 - 30 - 200 - 115 - 10) / 19);
  } else {
    adaptiveDatePeriodLength = Math.floor((width - 85 - 30 - 200 - 115 - 30) / 19);
  }
  return { adaptiveDatePeriodLength, mobile: width < 850 };
}

export default function useDatePeriod(periodDuration) {
  const settings = useGetSettingsQuery();
  const { width } = useWindowDimensions();
  const state = settings.data.overview_current_day;
  const offset = settings.data.overview_offset ?? 0;

  const getStart = () => {
    const curDate = startOfDay(new Date());
    if (state === 'start') return addDays(curDate, -offset);
    if (state === 'end') return addDays(curDate, -periodDuration + offset + 1);
    return addDays(curDate, -Math.floor(periodDuration / 2) + offset);
  };

  const getEnd = () => {
    const curDate = startOfDay(new Date());
    if (state === 'start') return addDays(curDate, periodDuration - offset - 1);
    if (state === 'end') return addDays(curDate, offset);
    return addDays(curDate, Math.floor(periodDuration / 2) + offset - 1 + periodDuration % 2);
  };

  const [dateStart, setDateStart] = useState(getStart());
  const [dateEnd, setDateEnd] = useState(getEnd());

  const subMonth = () => {
    const tmpStart = startOfMonth(
      isFirstDayOfMonth(dateStart) ? subMonths(dateStart, 1) : dateStart,
    );
    setDateStart(tmpStart);
    setDateEnd(addDays(tmpStart, periodDuration));
  };

  const addMonth = () => {
    const tmpStart = startOfMonth(addMonths(dateStart, 1));
    setDateStart(tmpStart);
    setDateEnd(addDays(tmpStart, periodDuration));
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
    setDateStart(addDays(tmpStart, -periodDuration + offset));
  };

  const setToFuture = () => {
    const tmpStart = startOfDay(new Date());
    setDateStart(addDays(tmpStart, -offset));
    setDateEnd(addDays(tmpStart, periodDuration - offset));
  };

  const reset = () => {
    setDateStart(getStart());
    setDateEnd(getEnd());
  };

  useKeyPress(['r'], reset);
  useKeyPress(['H'], subMonth);
  useKeyPress(['L'], addMonth);
  useKeyPress(['h'], subPeriod);
  useKeyPress(['l'], addPeriod);

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
