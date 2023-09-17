import { useState } from 'react';
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

export default function useDatePeriod(periodDuration) {
  const settings = useGetSettingsQuery();
  const state = settings.data.overview_current_is_first;
  const offset = settings.data.overview_offset ?? 0;

  const getStart = () => {
    const curDate = startOfDay(new Date());
    return state ? addDays(curDate, -offset) : addDays(curDate, -periodDuration + offset);
  };

  const getEnd = () => {
    const curDate = startOfDay(new Date());
    return state ? addDays(curDate, periodDuration - offset) : addDays(curDate, offset);
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

  return [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, subPeriod, addPeriod, setToPast, setToFuture, reset },
  ];
}
