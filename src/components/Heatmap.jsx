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
import { CellPeriod, TallDummy } from './HeatmapCells';
import { HeatmapMonths, HeatmapWeekdays } from './HeatmapHeaders';
import useLoaded from '../hooks/useLoaded';
import { useGetSettingsQuery } from '../state/services/settings';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function mixColors(base, goal, alpha) {
  const rgb = {
    r: Math.round(base.r + (goal.r - base.r) * alpha),
    g: Math.round(base.g + (goal.g - base.g) * alpha),
    b: Math.round(base.b + (goal.b - base.b) * alpha),
  };
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function generatePalette(base, goal) {
  const palette = [];
  for (let i = 0; i <= 10; i++) {
    const rgb = mixColors(base, goal, 0.1 * i);
    palette.push(rgb);
  }
  return palette;
}

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
  const { themeRgb } = useSelector((state) => ({
    themeRgb: state.theme.colorRgb,
  }));
  let Max = 0;

  const colorRGB = hexToRgb(color);
  const palette = generatePalette(themeRgb, colorRGB);
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
          {dummyHeight ? <TallDummy height={dummyHeight} /> : <> </>}
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
