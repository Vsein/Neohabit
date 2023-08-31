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

export default function useDatePeriod() {
  const [dateStart, setDateStart] = useState(startOfDay(new Date()));
  const [dateEnd, setDateEnd] = useState(addDays(dateStart, 31));

  const subMonth = (e) => {
    const tmpStart = startOfMonth(subMonths(isFirstDayOfMonth(dateStart) ? dateStart : dateEnd, 1));
    setDateStart(tmpStart);
    setDateEnd(addDays(tmpStart, 31));
  };

  const addMonth = (e) => {
    const tmpStart = startOfMonth(addMonths(dateStart, 1));
    setDateStart(tmpStart);
    setDateEnd(addDays(tmpStart, 31));
  };

  const subYear = (e) => {
    setDateStart(subYears(dateStart, 1));
    setDateEnd(subYears(dateEnd, 1));
  };

  const addYear = (e) => {
    setDateStart(addYears(dateStart, 1));
    setDateEnd(addYears(dateEnd, 1));
  };

  const setToPast = (e) => {
    const tmpStart = startOfDay(new Date());
    setDateEnd(tmpStart);
    setDateStart(addDays(tmpStart, -31));
  };

  const refresh = (e) => {
    const tmpStart = startOfDay(new Date());
    setDateStart(tmpStart);
    setDateEnd(addDays(tmpStart, 31));
  };

  return [dateEnd, dateStart, { subMonth, addMonth, subYear, addYear, setToPast, refresh }];
}
