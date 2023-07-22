import React from 'react';
import { useSelector } from 'react-redux';
import {
  addHours,
  subMilliseconds,
  min,
  max,
  startOfDay,
  differenceInHours,
  differenceInWeeks,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { CellPeriod, CellDummy } from './HeatmapCells';
import { HeatmapMonths, HeatmapWeekdays } from './HeatmapHeaders';
import useLoaded from '../hooks/useLoaded';
import usePaletteGenerator from '../hooks/usePaletteGenerator';
import { useGetSettingsQuery } from '../state/services/settings';

function Heatmap({
  dateStart,
  dateEnd,
  data,
  color,
  dayLength,
  dataPeriods,
  useElimination = true,
}) {
  const [loaded] = useLoaded();
  const settings = useGetSettingsQuery();
  let Max = 0;

  const palette = usePaletteGenerator(color);
  const diffWeeks = differenceInWeeks(addHours(endOfWeek(dateEnd), 1), startOfWeek(dateStart));

  let dateNow = dataPeriods[0].date;
  let i = 0;
  const periods = dataPeriods.map((period, index, periods) => {
    if (!periods[index + 1]) return [];
    const lastDate = min([dateEnd, periods[index + 1].date]);
    const periodChunks = [];
    while (dateNow < lastDate) {
      const startOfTheChunk = max([dateNow, dateStart]);
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
      periodChunks.push({
        color: palette[Math.min(10, Math.ceil(alpha * 10 + (alpha ? 1 : 0)))],
        value,
        dateStart: startOfTheChunk,
        dateEnd: subMilliseconds(endOfTheChunk, 1),
      });
      dateNow = endOfTheChunk;
    }
    return periodChunks;
  });

  const dummyLastDay = max([dateStart, dataPeriods[0].date]);
  const dummyHeight =
    differenceInHours(startOfDay(dummyLastDay), startOfWeek(dummyLastDay)) / 24;

  return !loaded ? (
    <div className="habit loading" />
  ) : (
    <div
      className="habit"
      style={{
        '--multiplier': settings.data.cell_height_multiplier,
        '--weeks': diffWeeks,
      }}
    >
      <h4>Habit</h4>
      <div className="heatmap">
        <HeatmapMonths dateStart={startOfWeek(dummyLastDay)} />
        <HeatmapWeekdays dateStart={dateStart} />
        <div
          className="heatmap-cells"
          style={{ '--cell-width': '11px', '--cell-height': '11px' }}
        >
          {dummyHeight ? <CellDummy length={dummyHeight} /> : <> </>}
          {periods.map((period, index) => (
            <>
              {period.map((chunk, Index) => (
                <CellPeriod
                  key={Index}
                  dateStart={chunk.dateStart}
                  dateEnd={chunk.dateEnd}
                  color={chunk.color}
                  value={chunk.value}
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
