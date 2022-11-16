import React from 'react';
import { Cell, CellPeriod, CellMonth } from './HeatmapCells';

function TimelineCells({ dateStart, dateEnd, data, colorFunc }) {
  const min = Math.min(0, ...data.map((d) => d.value));
  const max = Math.max(...data.map((d) => d.value));

  const colorMultiplier = 1 / (max - min);

  const isSameDay = (dateToCheck, actualDate) =>
    dateToCheck.getDate() === actualDate.getDate() &&
    dateToCheck.getMonth() === actualDate.getMonth() &&
    dateToCheck.getFullYear() === actualDate.getFullYear();

  const getPreviousDay = (date) =>
    new Date(new Date().setTime(date.getTime() - 24 * 3.6e6));
  const getNextDay = (date) =>
    new Date(new Date().setTime(date.getTime() + 24 * 3.6e6));
  let dateNow = dateStart;

  return (
    <div className="timeline-cells">
      {data.map((d, index) => {
        const value = d ? d.value : 0;
        const alpha = colorMultiplier * value;
        const datePeriodStart = dateNow;
        dateNow = getNextDay(d.date);
        const color = alpha ? colorFunc({ alpha }) : '#ccc';
        if (!isSameDay(getPreviousDay(d.date), dateNow)) {
          return (
            <>
              <CellPeriod
                dateStart={datePeriodStart}
                dateEnd={getPreviousDay(d.date)}
                multiplier={2}
              />
              <Cell
                key={index}
                index={index}
                value={value}
                date={d.date}
                color={color}
              />
            </>
          );
        }
        return (
          <Cell
            key={index}
            index={index}
            value={value}
            date={d.date}
            color={color}
          />
        );
      })}
      <CellPeriod dateStart={dateNow} dateEnd={dateEnd} multiplier={2} />
    </div>
  );
}

function TimelineMonthCells({ dateStart, dateEnd, data, colorFunc }) {
  // TODO: fix overlapping &-after and &-before colors
  const months = Array.from(new Array(Math.floor(13)));
  const colorMultiplier = 1 / 1600;
  console.log(data);
  let i = 0;
  return (
    <div className="timeline-cells">
      {months.map((_, index) => {
        const startOfTheMonth = new Date(
          new Date().setMonth(dateStart.getMonth() + index - 12, 1),
        );
        const endOfTheMonth = new Date(
          startOfTheMonth.getFullYear(),
          startOfTheMonth.getMonth() + 1,
          0,
        );
        let value = 0;
        while (i < data.length && data[i].date < endOfTheMonth) {
          value += data[i].value;
          i++;
        }
        const alpha = colorMultiplier * value;
        const color = alpha ? colorFunc({ alpha }) : '#e0e0e0';
        return (
          <CellPeriod
            key={index}
            dateStart={startOfTheMonth}
            dateEnd={endOfTheMonth}
            color={color}
            value={value}
            multiplier={2}
          />
        );
      })}
    </div>
  );
}

function TimelineWeekCells({ dateStart, dateEnd, data, colorFunc }) {
  const weeks = Array.from(new Array(Math.floor(53)));
  const colorMultiplier = 1 / 1000;
  console.log(data);
  let i = 0;
  return (
    <div className="timeline-cells">
      {weeks.map((_, index) => {
        const startOfTheWeek = new Date(
          new Date().setDate(
            dateStart.getDate() - dateStart.getDay() + index * 7 - 365,
          ),
        );
        const endOfTheWeek = new Date(
          new Date().setDate(
            dateStart.getDate() - dateStart.getDay() + 6 + index * 7 - 365,
          ),
        );
        let value = 0;
        while (i < data.length && data[i].date < endOfTheWeek) {
          value += data[i].value;
          i++;
        }
        const alpha = colorMultiplier * value;
        const color = alpha ? colorFunc({ alpha }) : '#e0e0e0';
        return (
          <CellPeriod
            key={index}
            dateStart={startOfTheWeek}
            dateEnd={endOfTheWeek}
            color={color}
            value={value}
            multiplier={2}
          />
        );
      })}
    </div>
  );
}

export { TimelineCells, TimelineMonthCells, TimelineWeekCells };
