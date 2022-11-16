import React from 'react';

function Month({ dateStart, index }) {
  const date = new Date(new Date().setTime(dateStart.getTime() + index * 7 * 24 * 3.6e6));
  const monthName = date.toLocaleString('en-US', { month: 'short' });

  return (
    <div className={`timeline-months-month ${monthName}`}>{monthName}</div>
  );
}

function TimelineMonths({ dateStart }) {
  const months = Array.from(new Array(Math.floor(365 / 7)));
  return (
    <div className="timeline-months">
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
  return <div className="timeline-weekdays-weekday">{DayNames[index]}</div>;
}

function TimelineWeekdays({ dateStart }) {
  const weekDays = Array.from(new Array(7));
  return (
    <div className="timeline-weekdays">
      {weekDays.map((_, index) => (
        <WeekDay key={index} index={index} dateStart={dateStart} />
      ))}
    </div>
  );
}

export {
  TimelineMonths,
  TimelineWeekdays,
};
