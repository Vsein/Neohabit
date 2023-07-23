import { useState } from 'react';
import {
  startOfDay,
  startOfMonth,
  lastDayOfMonth,
  subMonths,
  addMonths,
  subYears,
  addYears,
} from 'date-fns';

export default function useDatePeriod() {
  const [dateEnd, setDateEnd] = useState(startOfDay(new Date()));
  const [dateStart, setDateStart] = useState(subMonths(dateEnd, 1));

  const subMonth = (e) => {
    const tmpStart = subMonths(dateEnd, 1);
    setDateStart(startOfMonth(tmpStart));
    setDateEnd(lastDayOfMonth(tmpStart));
  };

  const addMonth = (e) => {
    const tmpStart = addMonths(dateStart, 1);
    setDateStart(startOfMonth(tmpStart));
    setDateEnd(lastDayOfMonth(tmpStart));
  };

  const subYear = (e) => {
    setDateStart(subYears(dateStart, 1));
    setDateEnd(subYears(dateEnd, 1));
  };

  const addYear = (e) => {
    setDateStart(addYears(dateStart, 1));
    setDateEnd(addYears(dateEnd, 1));
  };

  const refresh = (e) => {
    const tmpStart = startOfDay(new Date());
    setDateEnd(tmpStart);
    setDateStart(subMonths(tmpStart, 1));
  };

  return [
    dateEnd,
    dateStart,
    { subMonth, addMonth, subYear, addYear, refresh },
  ];
}
