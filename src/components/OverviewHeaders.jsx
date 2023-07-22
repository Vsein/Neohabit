import React from 'react';
import {
  differenceInDays,
  getDate,
  addDays,
  isToday,
  isWeekend,
} from 'date-fns';

function Month({ dateStart, index }) {
  const date = addDays(dateStart, index);
  const monthName = date.toLocaleString('en-US', { month: 'short' });
  if (getDate(date) === 1 || index === 0) {
    return <div className="overview-months-month active">{monthName}</div>;
  }
  return <div className="overview-months-month">{monthName}</div>;
}

function OverviewMonths({ dateStart, dateEnd }) {
  const days = Array.from(new Array(differenceInDays(dateEnd, dateStart) + 1));
  return (
    <div className="overview-months">
      {days.map((_, index) => (
        <Month key={index} index={index} dateStart={dateStart} />
      ))}
    </div>
  );
}

function Day({ dateStart, index }) {
  const date = addDays(dateStart, index);
  return (
    <div
      className={`overview-days-day ${isToday(date) ? 'today' : ''} ${
        isWeekend(date) ? 'weekend' : ''
      }`}
    >
      {getDate(date)}
    </div>
  );
}

function OverviewDays({ dateStart, dateEnd }) {
  const days = Array.from(new Array(differenceInDays(dateEnd, dateStart) + 1));
  return (
    <div className="overview-days">
      {days.map((_, index) => (
        <Day key={index} index={index} dateStart={dateStart} />
      ))}
    </div>
  );
}

export { OverviewMonths, OverviewDays };
