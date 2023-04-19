import React from 'react';
import {
  addDays,
  addHours,
  subMilliseconds,
  min,
  max,
  startOfDay,
  differenceInHours,
  startOfWeek,
} from 'date-fns';
import { CellPeriod, TallDummy } from './HeatmapCells';
import { HeatmapMonths, HeatmapWeekdays } from './HeatmapHeaders';
import useLoaded from '../hooks/useLoaded';

function Heatmap({
  dateStart,
  dateEnd,
  data = [],
  colorFunc,
  dayLength,
  useElimination = true,
}) {
  const [loaded] = useLoaded();

  let dateNow = dateStart;
  let i = 0;
  const periods = [];
  while (dateNow < dateEnd) {
    const startOfTheChunk = max([dateNow, dateStart]);
    let value = 0;
    while (i < data.length) {
      value += data[i].value;
      i++;
    }
    const endOfTheChunk = value ? min([addDays(dateNow, value), dateEnd]) : dateEnd;
    const alpha = 0;
    const color = alpha ? colorFunc({ alpha }) : '#e0e0e0';
    periods.push({
      color,
      value,
      dateStart: startOfTheChunk,
      dateEnd: subMilliseconds(endOfTheChunk, 1),
    });
    dateNow = endOfTheChunk;
  }

  const dummyLastDay = dateStart;
  const dummyHeight =
    differenceInHours(startOfDay(dummyLastDay), startOfWeek(dummyLastDay)) / 24;

  return !loaded ? (
    <div
      className="habit loading"
      style={{ backgroundColor: '#ddd', borderRadius: '20px' }}
    />
  ) : (
    <div className="habit">
      <h4>Habit</h4>
      <div className="heatmap" style={{ '--multiplier': dayLength }}>
        <HeatmapMonths dateStart={startOfWeek(dummyLastDay)} />
        <HeatmapWeekdays dateStart={dateStart} />
        <div className="heatmap-cells">
          <TallDummy height={dummyHeight} />
          {periods.map((chunk, index) => (
            <CellPeriod
              key={index}
              dateStart={chunk.dateStart}
              dateEnd={chunk.dateEnd}
              color={chunk.color}
              value={chunk.value}
              multiplier={2}
              basePeriod={24}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { Heatmap };
