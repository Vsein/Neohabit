import { useState, useEffect } from 'react';
import { startOfDay, subMonths, addMonths } from 'date-fns';

export default function useDatePeriod() {
  const [dateEnd, setDateEnd] = useState(startOfDay(new Date()));
  const [dateStart, setDateStart] = useState(subMonths(dateEnd, 1));

  const moveLeft = (e) => {
    setDateStart(subMonths(dateStart, 1));
    setDateEnd(subMonths(dateEnd, 1));
  };

  const moveRight = (e) => {
    setDateStart(addMonths(dateStart, 1));
    setDateEnd(addMonths(dateEnd, 1));
  };

  return [dateEnd, dateStart, { moveLeft, moveRight }];
}
