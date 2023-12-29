import React from 'react';
import {
  addWeeks,
  getWeekOfMonth,
  differenceInDays,
  getDate,
  addDays,
  isToday,
  isWeekend,
  isLastDayOfMonth,
} from 'date-fns';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

function MonthWeekly({ dateStart, index }) {
  const date = addWeeks(dateStart, index);
  const monthName = monthNames[date.getMonth()];
  if (getWeekOfMonth(date) === 2 && index !== 1 || (index === 0 && getWeekOfMonth(date) <= 3)) {
    return <div className="heatmap-months-month active">{monthName}</div>;
  }
  return <div className="heatmap-months-month">{monthName}</div>;
}

function HeatmapMonthsWeekly({ dateStart }) {
  const months = Array.from(new Array(Math.floor(365 / 7)));
  return (
    <div className="heatmap-months">
      {months.map((_, index) => (
        <MonthWeekly key={index} index={index} dateStart={dateStart} />
      ))}
    </div>
  );
}

function MonthDaily({ dateStart, index }) {
  const date = addDays(dateStart, index);
  const monthName = monthNames[date.getMonth()];
  if (getDate(date) === 1 || (index === 0 && !isLastDayOfMonth(date))) {
    return <div className="heatmap-months-month active">{monthName}</div>;
  }
  return <div className="heatmap-months-month">{monthName}</div>;
}

function HeatmapMonthsDaily({ dateStart, dateEnd }) {
  const days = Array.from(new Array(differenceInDays(dateEnd, dateStart) + 1));
  return (
    <div className="heatmap-months">
      {days.map((_, index) => (
        <MonthDaily key={index} index={index} dateStart={dateStart} />
      ))}
    </div>
  );
}

const DayNames = {
  1: 'Mon',
  3: 'Wed',
  5: 'Fri',
};

function Weekday({ index }) {
  return <div className="heatmap-weekdays-weekday">{DayNames[index]}</div>;
}

function HeatmapWeekdays({ dateStart }) {
  const weekDays = Array.from(new Array(7));
  return (
    <div className="heatmap-weekdays">
      {weekDays.map((_, index) => (
        <Weekday key={index} index={index} dateStart={dateStart} />
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

function HeatmapDays({ dateStart, dateEnd }) {
  const days = Array.from(new Array(differenceInDays(dateEnd, dateStart) + 1));
  return (
    <div className="overview-days">
      {days.map((_, index) => (
        <Day key={index} index={index} dateStart={dateStart} />
      ))}
    </div>
  );
}

export { HeatmapMonthsWeekly, HeatmapMonthsDaily, HeatmapWeekdays, HeatmapDays };
