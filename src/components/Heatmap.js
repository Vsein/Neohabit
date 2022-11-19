import React, { useState, useEffect } from 'react';
import {
  addHours,
  subMilliseconds,
  min,
  startOfDay,
  differenceInHours,
  startOfWeek,
} from 'date-fns';
import { CellPeriod, TallDummy } from './HeatmapCells';
import { HeatmapMonths, HeatmapWeekdays } from './HeatmapHeaders';

function Heatmap({
  dateStart,
  dateEnd,
  data,
  colorFunc,
  dayLength,
  dataPeriods,
  useElimination = true,
}) {
  const [periods, setPeriods] = useState([]);
  let Max = 0;

  useEffect(() => {
    let dateNow = dataPeriods[0].date;
    let i = 0;
    const populatedPeriods = dataPeriods.map((period, index, periods) => {
      if (!periods[index + 1]) return [];
      const lastDate = min([dateEnd, periods[index + 1].date]);
      const periodChunks = [];
      while (dateNow < lastDate) {
        const startOfTheChunk = dateNow;
        const endOfTheChunk = period.frequency
          ? min([addHours(dateNow, period.frequency), dateEnd])
          : lastDate;
        let value = 0;
        while (i < data.length && data[i].date < endOfTheChunk) {
          value += data[i].value;
          i++;
        }
        if (value > Max) Max = value;
        let alpha;
        if (useElimination) {
          alpha = period.frequency / (24 * 7);
        } else {
          alpha = (1 / Max) * value;
        }
        const color = alpha ? colorFunc({ alpha }) : '#e0e0e0';
        periodChunks.push({
          color,
          value,
          dateStart: startOfTheChunk,
          dateEnd: subMilliseconds(endOfTheChunk, 1),
        });
        dateNow = endOfTheChunk;
      }
      return periodChunks;
    });
    setPeriods(populatedPeriods);
  }, []);

  const dummyLastDay = min([dateStart, dataPeriods[0].date]);
  const dummyHeight =
    differenceInHours(startOfDay(dummyLastDay), startOfWeek(dummyLastDay)) / 24;

  return (
    <div className="habit">
      <h4>Habit</h4>
      <div className="heatmap" style={{ '--multiplier': dayLength }}>
        <HeatmapMonths dateStart={dateStart} />
        <HeatmapWeekdays dateStart={dateStart} />
        <div className="heatmap-cells">
          <TallDummy height={dummyHeight} />
          {periods.map((period, index) => (
            <>
              {period.map((chunk, Index) => (
                <CellPeriod
                  key={Index}
                  dateStart={chunk.dateStart}
                  dateEnd={chunk.dateEnd}
                  color={chunk.color}
                  value={chunk.value}
                  multiplier={2}
                  basePeriod={24}
                />
              ))}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export { Heatmap };
