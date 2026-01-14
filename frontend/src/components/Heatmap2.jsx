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
import { areAscending } from '../utils/dates';

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
  vertical = false,
  isOverview, // NOTE: Maybe change to is2D or is1D, much more clear this way
  overridenElimination = undefined,
  overridenNumeric = undefined,
}) {
  const heatmapData = habit?.data ?? [];
  const heatmapTargets = habit?.targets ?? [];

  const fti = heatmapTargets.findLastIndex((t) => areAscending(t.date_start, dateStart));
  const lti = heatmapTargets.findLastIndex((t) => areAscending(t.date_start, dateEnd));
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
  const lastBucket = { dateStart: startOfDay(habitStartDate), dateEnd: min([dateEnd, windowDateEnd].filter((d) => isValid(d))), value: 0 };
  // console.log(daysToHabitStart, firstDummyBucket);

  const buckets = [firstDummyBucket,
    ...heatmapTargets.slice(fti, lti + 1).flatMap((t) => []),
    lastBucket].flatMap(b => b);
  // console.log("buckets: ", buckets, habitCreatedAt, habit.name);

  // TODO: I want to get rid of it tbh
  const elimination = overridenElimination ?? habit?.elimination;
  const numeric = overridenNumeric ?? habit?.numeric;

  const firstDataIndex = heatmapData.findIndex((d) => areAscending(windowDateStart || dateStart, d.date));
  let j = firstDataIndex === -1 ? heatmapData.length : firstDataIndex;
  console.log("First data index: ", firstDataIndex, "][ Start from element: ", j);
  // let j = 0;

  const hasNextDataPoint = (bucket) => j < heatmapData.length ?
    areAscending(bucket.dateStart, new Date(heatmapData[j].date), bucket.dateEnd)
    : undefined;

  // Populating buckets with data and turning them into cells
  const Cells = buckets.map((b, i) => {

    // Case 1. Handle <target cells> that already have a determined dateStart, dateEnd and targetValue
    if (b.isTarget) {
      // TODO: Handling of cycles
      const cell = { ...b, value: 0 };
      while (hasNextDataPoint(b)) {
        cell.value += heatmapData[j].value;
        j += 1;
      }
      return <CellPeriod key={i} />
    }

    // Case 2. Handle <bucketed cells>
    let cell = { dateStart: max([b.dateStart, dateStart]), value: 0, dummy: b.dummy };
    const cells = [];

    let date;
    let bucketHasDataPoints = false;
    while (hasNextDataPoint(b)) {
      date = startOfDay(new Date(heatmapData[j].date));

      // Handle the [previous period], up to the # data point:  [----]# or [#----]# or [#]#
      if (differenceInDays(date, cell.dateStart) >= 1) {

        // Handle {data cell}:   [{#}----]# or [{#}]#
        if (cell.value) {
          cell.dateEnd = endOfDay(cell.dateStart);
          cells.push(cell);
          cell = { dateStart: addDays(cell.dateStart, 1), value: 0 };
        }

        // Handle {empty period}:  [#{----}]# or [{----}]#
        if (differenceInDays(date, cell.dateStart) >= 1) {
          cell.dateEnd = subMilliseconds(date, 1);
          cells.push(cell);
          cell = { dateStart: date, value: 0 };
        }
      }

      cell.value += heatmapData[j].value;
      cell.dateEnd = endOfDay(date);
      j += 1; bucketHasDataPoints = true;
    }

    if (bucketHasDataPoints) {
      // Handle the last data point # and the ---- empty period after (if it exists):  [#] and [#----]
      cells.push(cell);
      cell = { dateStart: addDays(date, 1), dateEnd: b.dateEnd, value: 0 };
      if (areAscending(cell.dateStart, cell.dateEnd)) {
        cells.push(cell);
      }
    } else {
      // Handle only the empty period:  [----]
      cell.dateEnd = b.dateEnd;
      cells.push(cell);
    }

    console.log(cells, i, habit.name);

    return <React.Fragment key={i}>
      {cells.map((c, k) =>
        <CellPeriod
          key={`${i}-${k}`}
          dummy={c.dummy}
          habitID={habit.id}
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
