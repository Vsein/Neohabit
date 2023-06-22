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

function Heatmap({
  dateStart,
  dateEnd,
  heatmap = {
    data: [],
  },
  colorFunc,
  dayLength,
  useElimination = true,
}) {
  const [loaded] = useLoaded();
  const Data = heatmap.data;
  const data = [...Data];
  data.sort((a, b) => new Date(a.date) - new Date(b.date));

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
      color: colorFunc({ alpha: 1 }),
      value: 1000,
      dateStart: dateStartChunk,
      dateEnd: subMilliseconds(addHours(startOfDay(new Date(data[i].date)), 24), 1),
    });
    dateNow = addHours(dateStartChunk, 24);
  }
  periods.push({
    color: '',
    value: 0,
    dateStart: dateNow,
    dateEnd: dateEnd,
  })
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
        <DataPointForm onSubmit={onSubmit}/>
      </div>
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
