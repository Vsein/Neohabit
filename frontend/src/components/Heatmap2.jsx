import React from 'react';
import {
  differenceInDays,
  addDays,
  compareDesc,
  startOfDay,
  endOfDay,
  startOfWeek,
  min,
  max,
  subMilliseconds,
  compareAsc,
  isValid,
} from 'date-fns';
import { CellPeriod, CellDummy } from './HeatmapCells';
import { getNumericTextColor } from '../hooks/usePaletteGenerator';

function getWindowDateStart(dateStart, firstTarget) {
  if (firstTarget) {
    const diffInCycles = Math.floor(differenceInDays(dateStart, firstTarget) / firstTarget.period);
    return addDays(firstTarget.date, diffInCycles * firstTarget.period);
  }
  return undefined;
}

function getWindowDateEnd(dateEnd, lastTarget) {
  if (lastTarget) {
    const diffInCycles = Math.ceil(differenceInDays(dateEnd, lastTarget) / lastTarget.period);
    return addDays(lastTarget.date, diffInCycles * lastTarget.period);
  }
  return undefined;
}

export default function Heatmap({
  dateStart,
  dateEnd,
  habit,
  heatmapData,
  heatmapTargets = [],
  heatmapID,
  vertical = false,
  isOverview, // NOTE: Maybe change to is2D or is1D, much more clear this way
  overridenElimination = undefined,
  overridenNumeric = undefined,
}) {
  const fti = heatmapTargets.findLastIndex((t) => compareAsc(dateStart, t.date_start) >= 0);
  const lti = heatmapTargets.findLastIndex((t) => compareAsc(dateEnd, t.date_start) >= 0);
  const firstTarget = heatmapTargets[fti];
  const lastTarget = heatmapTargets[lti];

  const windowDateStart = getWindowDateStart(dateStart, firstTarget);
  const windowDateEnd = getWindowDateEnd(dateEnd, lastTarget);
  // console.log(windowDateStart, windowDateEnd);

  const habitCreatedAt = new Date(habit.created_at);
  const habitStartDate = min([habitCreatedAt, windowDateStart].filter((d) => isValid(d)));
  // console.log(habitStartDate);
  const daysToHabitStart = differenceInDays(habitStartDate, dateStart);

  // Calculate buckets
  // TODO: Maybe remake CellPeriods to have [ ) type constaints, I'm tired of subtracting a millisecond each time

  // XXX: Must add a wrapping [], or just flatMap the buckets or something
  const firstDummyBucket = daysToHabitStart > 0 ? { dateStart, dateEnd: subMilliseconds(startOfDay(habitStartDate), 1), value: 0, dummy: true } : [];
  const lastBucket = { dateStart: habitStartDate, dateEnd: min([dateEnd, windowDateEnd].filter((d) => isValid(d))), value: 0 };
  // console.log(daysToHabitStart, firstDummyBucket);

  const buckets = [firstDummyBucket,
    ...heatmapTargets.slice(fti, lti + 1).flatMap((t) => []),
    lastBucket].flatMap(b => b);
  // console.log(buckets, habitCreatedAt, habit.name);

  // TODO: I want to get rid of it tbh
  const elimination = overridenElimination ?? habit?.elimination;
  const numeric = overridenNumeric ?? habit?.numeric;

  // Populating buckets with data and turn them into cells
  let j = 0;
  const Cells = buckets.map((b, i) => {
    if (b.isTarget) {
      // TODO: Handling of cycles
      const cell = { ...b, value: 0 };
      while (j < heatmapData.length && compareAsc(b.dateStart, heatmapData[j].date) > 0) {
        cell.value += heatmapData[j].value;
        j += 1;
      }
      return <CellPeriod key={i} />
    }

    let cell = { dateStart: b.dateStart, value: 0, dummy: b.dummy };
    const cells = [];
    while (j < heatmapData.length && compareAsc(b.dateStart, heatmapData[j].date) > 0) {
      const date = startOfDay(new Date(heatmapData[j].date));
      cell.dateEnd = date;
      cells.push(cell);
      cell = { dateStart: date, value: heatmapData[j].value };
      j += 1;
    }
    cell.dateEnd = b.dateEnd;
    // console.log(cell);
    cells.push(cell);
    // console.log(cells);

    return <React.Fragment key={i}>
      {cells.map((c) =>
        <CellPeriod
          key={i}
          dummy={c.dummy}
          heatmapID={heatmapID}
          dateStart={startOfDay(c.dateStart)}
          dateEnd={endOfDay(c.dateEnd)}
          color={habit.color}
          value={c.value}
          basePeriod={24}
          vertical={vertical}
          elimination={elimination}
          numeric={numeric}
          isOverview={isOverview}
        />
      )}
    </React.Fragment>
  });

  return (
    <div
      className={`overview-habit-cells ${isOverview ? '' : 'weekly'}`}
      style={{ '--numeric-text-color': getNumericTextColor(habit.color) }}
    >
      {Cells}
    </div>
  );
}
