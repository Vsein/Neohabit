import React from 'react';
import {
  addWeeks,
  getWeekOfMonth,
  differenceInDays,
  getDate,
  getDay,
  addDays,
  isToday,
  isWeekend,
  isLastDayOfMonth,
  isSameWeek,
} from 'date-fns';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

function MonthWeekly({ dateStart, index, length }) {
  const date = addWeeks(dateStart, index);
  const monthName = monthNames[date.getMonth()];
  if (isSameWeek(date, new Date())) {
    if (getWeekOfMonth(date) === 2 && index !== length - 1) {
      return <div className="heatmap-months-month active same-month">{monthName}</div>;
    }
    return <div className="heatmap-months-month same-month arrow">&#9660;</div>;
  }
  if (getWeekOfMonth(date) === 2 || index === 0) {
    return <div className="heatmap-months-month active">{monthName}</div>;
  }
  return <div className="heatmap-months-month">{monthName}</div>;
}

function HeatmapMonthsWeekly({ dateStart, diffWeeks }) {
  const months = Array.from(new Array(diffWeeks));
  return (
    <div className="heatmap-months">
      {months.map((_, index) => (
        <MonthWeekly key={index} index={index} dateStart={dateStart} length={diffWeeks} />
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
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
};

function Weekday({ index }) {
  const sameWeekday = getDay(new Date()) === index;
  return <div className={`heatmap-weekdays-weekday ${sameWeekday ? 'same-weekday' : ''}`}>{(!!(index % 2) || sameWeekday) && DayNames[index]}</div>;
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
