import React from 'react';
import { isSameDay, subDays, addDays } from 'date-fns';
import { Cell, CellPeriod } from './HeatmapCells';
import { TimelineMonths, TimelineWeekdays } from './HeatmapHeaders';

function TimelineSimple({ dateStart, dateEnd, colorFunc, dayLength, data }) {
  const cells = Array.from(new Array(data.length));

  const min = Math.min(0, ...data.map((d) => d.value));
  const max = Math.max(...data.map((d) => d.value));

  const colorMultiplier = 1 / (max - min);

  return (
    <div className="timeline" style={{ '--multiplier': dayLength }}>
      <div />
      <TimelineMonths dateStart={dateStart} />
      <TimelineWeekdays dateStart={dateStart} />
      <div className="timeline-cells">
        {Array.from(new Array(data[0].date.getDay() + 1)).map((_, index) => (
          <Cell key={index} color="#00000000" date="" />
        ))}
        {cells.map((_, index) => {
          const date = addDays(dateStart, index);
          const dataPoint = data.find((d) => isSameDay(date, d.date));
          const value = dataPoint ? dataPoint.value : 0;
          const alpha = colorMultiplier * value;
          const height = dataPoint ? dataPoint.height : 1;
          const width = dataPoint ? dataPoint.width : 1;
          const color = colorFunc({ alpha });

          return (
            <Cell
              key={index}
              index={index}
              value={value}
              date={date}
              height={height}
              width={width}
              color={color}
            />
          );
        })}
      </div>
    </div>
  );
}

function TimelineCells({ dateStart, dateEnd, data, colorFunc, dayLength }) {
  const min = Math.min(0, ...data.map((d) => d.value));
  const max = Math.max(...data.map((d) => d.value));
  const colorMultiplier = 1 / (max - min);
  let dateNow = dateStart;

  return (
    <div className="timeline" style={{ '--multiplier': dayLength }}>
      <div />
      <TimelineMonths dateStart={dateStart} />
      <TimelineWeekdays dateStart={dateStart} />
      <div className="timeline-cells">
        {data.map((d, index) => {
          const value = d ? d.value : 0;
          const alpha = colorMultiplier * value;
          const datePeriodStart = dateNow;
          dateNow = addDays(d.date, 1);
          const color = alpha ? colorFunc({ alpha }) : '#ccc';
          if (!isSameDay(subDays(d.date, 1), dateNow)) {
            return (
              <>
                <CellPeriod
                  dateStart={datePeriodStart}
                  dateEnd={subDays(d.date, 1)}
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
    </div>
  );
}

function TimelineMonthCells({
  dateStart,
  dateEnd,
  data,
  colorFunc,
  dayLength,
}) {
  // TODO: fix overlapping &-after and &-before colors
  const months = Array.from(new Array(Math.floor(13)));
  const colorMultiplier = 1 / 1600;
  console.log(data);
  let i = 0;
  return (
    <div className="timeline" style={{ '--multiplier': dayLength }}>
      <div />
      <TimelineMonths dateStart={dateStart} />
      <TimelineWeekdays dateStart={dateStart} />
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
    </div>
  );
}

function TimelineWeekCells({ dateStart, dateEnd, data, colorFunc, dayLength }) {
  const weeks = Array.from(new Array(Math.floor(53)));
  const colorMultiplier = 1 / 1000;
  console.log(data);
  let i = 0;
  return (
    <div className="timeline" style={{ '--multiplier': dayLength }}>
      <div /> {/* a temporary empty element for a grid */}
      <TimelineMonths dateStart={dateStart} />
      <TimelineWeekdays dateStart={dateStart} />
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
    </div>
  );
}

export {
  TimelineSimple,
  TimelineCells,
  TimelineMonthCells,
  TimelineWeekCells,
};
