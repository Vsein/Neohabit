import React, { useEffect } from 'react';
import {
  addHours,
  subMilliseconds,
  startOfDay,
  differenceInHours,
  differenceInWeeks,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { CellPeriod, CellDummy } from './HeatmapCells';
import { HeatmapMonths, HeatmapWeekdays } from './HeatmapHeaders';
import useLoaded from '../hooks/useLoaded';
import { useUpdateHeatmapMutation } from '../state/services/heatmap';
import DataPointForm from './DataPointForm';
import { useGetSettingsQuery } from '../state/services/settings';

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
  const settings = useGetSettingsQuery();
  const Data = heatmap?.data ?? [];
  const data = [...Data];
  data.sort((a, b) => new Date(a.date) - new Date(b.date));

  const diffWeeks = differenceInWeeks(addHours(endOfWeek(dateEnd), 1), startOfWeek(dateStart));

  let dateNow = dateStart;
  let i = 0;
  const periods = [];
  for (let i = 0; i < data.length; i++) {
    const dateStartChunk = startOfDay(new Date(data[i].date));
    const diffDays = differenceInHours(dateStartChunk, dateNow) / 24;
    if (diffDays) {
      periods.push({
        color: '',
        value: 0,
        dateStart: dateNow,
        dateEnd: subMilliseconds(dateStartChunk, 1),
      });
    }
    periods.push({
      color,
      value: 1000,
      dateStart: dateStartChunk,
      dateEnd: subMilliseconds(addHours(dateStartChunk, 24), 1),
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
  const dummyHeight = differenceInHours(startOfDay(dummyLastDay), startOfWeek(dummyLastDay)) / 24;

  const [updateHeatmap] = useUpdateHeatmapMutation();
  const onSubmit = async (values) => {
    await updateHeatmap({ heatmapID: heatmap._id, values });
  };

  return !loaded ? (
    <div className="habit loading" />
  ) : (
    <div
      className="habit"
      style={{
        '--multiplier': settings.data.cell_height_multiplier,
        '--weeks': diffWeeks,
        '--cell-width': '11px',
        '--cell-height': '11px',
      }}
    >
      <div className="habit-header">
        <h4>Habit</h4>
        <DataPointForm onSubmit={onSubmit} />
      </div>
      <div className="heatmap">
        <HeatmapMonths dateStart={startOfWeek(dummyLastDay)} />
        <HeatmapWeekdays dateStart={dateStart} />
        <div className="heatmap-cells">
          {dummyHeight ? <CellDummy length={dummyHeight} /> : <> </>}
          {periods.map((chunk, index) => (
            <CellPeriod
              key={index}
              dateStart={chunk.dateStart}
              dateEnd={chunk.dateEnd}
              color={chunk.color}
              value={chunk.value}
              basePeriod={24}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { Heatmap };
