import React, { useEffect } from 'react';
import {
  addHours,
  subMilliseconds,
  startOfDay,
  differenceInHours,
  startOfWeek,
} from 'date-fns';
import { CellPeriod, TallDummy } from './HeatmapCells';
import { HeatmapMonths, HeatmapWeekdays } from './HeatmapHeaders';
import useLoaded from '../hooks/useLoaded';
import { useUpdateHeatmapMutation } from '../state/services/heatmap';
import DataPointForm from './DataPointForm';

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

function Heatmap({
  dateStart,
  dateEnd,
  heatmap = {
    data: [],
  },
  color,
  dayLength,
  useElimination = true,
}) {
  const [loaded] = useLoaded();
  const Data = heatmap?.data ?? [];
  const data = [...Data];
  data.sort((a, b) => new Date(a.date) - new Date(b.date));

  const colorRGB = hexToRgb(color);
  const themeBGSupportColor =
    document.documentElement.className === 'dark'
      ? { r: 204, g: 204, b: 204 }
      : { r: 165, g: 158, b: 205 };

  function mixColors(base, goal, alpha) {
    const rgb = {
      r: Math.round(base.r + (goal.r - base.r) * alpha),
      g: Math.round(base.g + (goal.g - base.g) * alpha),
      b: Math.round(base.b + (goal.b - base.b) * alpha),
    }
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }

  let dateNow = dateStart;
  let i = 0;
  const periods = [];
  for (let i = 0; i < data.length; i++) {
    const dateStartChunk = startOfDay(new Date(data[i].date));
    periods.push({
      color: '',
      value: 0,
      dateStart: dateNow,
      dateEnd: subMilliseconds(startOfDay(new Date(data[i].date)), 1),
    });
    periods.push({
      color: mixColors(themeBGSupportColor, colorRGB, 1),
      value: 1000,
      dateStart: dateStartChunk,
      dateEnd: subMilliseconds(
        addHours(startOfDay(new Date(data[i].date)), 24),
        1,
      ),
    });
    dateNow = addHours(dateStartChunk, 24);
  }
  periods.push({
    color: '',
    value: 0,
    dateStart: dateNow,
    dateEnd: dateEnd,
  });
  console.log(periods);

  const dummyLastDay = dateStart;
  const dummyHeight =
    differenceInHours(startOfDay(dummyLastDay), startOfWeek(dummyLastDay)) / 24;

  const [updateHeatmap] = useUpdateHeatmapMutation();
  const onSubmit = async (values) => {
    await updateHeatmap({ heatmapID: heatmap._id, values });
  };

  return !loaded ? (
    <div className="habit loading" />
  ) : (
    <div className="habit">
      <div className="habit-header">
        <h4>Habit</h4>
        <DataPointForm onSubmit={onSubmit} />
      </div>
      <div className="heatmap" style={{ '--multiplier': dayLength }}>
        <HeatmapMonths dateStart={startOfWeek(dummyLastDay)} />
        <HeatmapWeekdays dateStart={dateStart} />
        <div className="heatmap-cells">
          {dummyHeight ? <TallDummy height={dummyHeight} /> : <> </>}
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
