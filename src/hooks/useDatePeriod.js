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
} from 'date-fns';
import { useGetSettingsQuery } from '../state/services/settings';

export default function useDatePeriod(periodDuration) {
  const settings = useGetSettingsQuery();
  const state = settings.data.overview_current_is_first;

  const getStart = () => {
    const curDate = startOfDay(new Date());
    return state ? useState(curDate) : useState(addDays(curDate, -periodDuration));
  };

  const getEnd = () => {
    const curDate = startOfDay(new Date());
    return state ? useState(addDays(curDate, periodDuration)) : useState(curDate);
  };

  const [dateStart, setDateStart] = getStart();
  const [dateEnd, setDateEnd] = getEnd();

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

  const setToPast = () => {
    const tmpStart = startOfDay(new Date());
    setDateEnd(tmpStart);
    setDateStart(addDays(tmpStart, -periodDuration));
  };

  const setToFuture = () => {
    const tmpStart = startOfDay(new Date());
    setDateStart(tmpStart);
    setDateEnd(addDays(tmpStart, periodDuration));
  };

  const reset = () => {
    const curDate = startOfDay(new Date());
    setDateStart(state ? curDate : addDays(curDate, -periodDuration));
    setDateEnd(state ? addDays(curDate, periodDuration) : curDate);
  };

  return [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, setToPast, setToFuture, reset },
  ];
}
