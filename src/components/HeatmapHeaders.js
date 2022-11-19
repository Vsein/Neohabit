import React from 'react';
import { addWeeks, getWeekOfMonth } from 'date-fns';

function Month({ dateStart, index }) {
  const date = addWeeks(dateStart, index);
  const monthName = date.toLocaleString('en-US', { month: 'short' });
  if (getWeekOfMonth(date) === 2 || index === 0) {
    return <div className="heatmap-months-month active">{monthName}</div>;
  }
  return <div className="heatmap-months-month">{monthName}</div>;
}

function HeatmapMonths({ dateStart }) {
  const months = Array.from(new Array(Math.floor(365 / 7)));
  return (
    <div className="heatmap-months">
      {months.map((_, index) => (
        <Month key={index} index={index} dateStart={dateStart} />
      ))}
    </div>
  );
}

const DayNames = {
  1: 'Mon',
  3: 'Wed',
  5: 'Fri',
};

function WeekDay({ index }) {
  return <div className="heatmap-weekdays-weekday">{DayNames[index]}</div>;
}

function HeatmapWeekdays({ dateStart }) {
  const weekDays = Array.from(new Array(7));
  return (
    <div className="heatmap-weekdays">
      {weekDays.map((_, index) => (
        <WeekDay key={index} index={index} dateStart={dateStart} />
      ))}
    </div>
  );
}

export { HeatmapMonths, HeatmapWeekdays };
