import { useState } from 'react';
import { startOfDay, subMonths, addMonths, subYears, addYears } from 'date-fns';

export default function useDatePeriod() {
  const [dateEnd, setDateEnd] = useState(startOfDay(new Date()));
  const [dateStart, setDateStart] = useState(subMonths(dateEnd, 1));

  const subMonth = (e) => {
    setDateStart(subMonths(dateStart, 1));
    setDateEnd(subMonths(dateEnd, 1));
  };

  const addMonth = (e) => {
    setDateStart(addMonths(dateStart, 1));
    setDateEnd(addMonths(dateEnd, 1));
  };

  const subYear = (e) => {
    setDateStart(subYears(dateStart, 1));
    setDateEnd(subYears(dateEnd, 1));
  };

  const addYear = (e) => {
    setDateStart(addYears(dateStart, 1));
    setDateEnd(addYears(dateEnd, 1));
  };

  return [dateEnd, dateStart, { subMonth, addMonth, subYear, addYear }];
}
