import React from 'react';
import {
  differenceInDays,
  addDays,
  startOfDay,
  endOfDay,
  min,
  max,
  subMilliseconds,
  isValid,
} from 'date-fns';
import { CellPeriod, CellDummy } from './HeatmapCells';
import { getNumericTextColor } from '../hooks/usePaletteGenerator';
import { areAscending, minValidDate, maxValidDate } from '../utils/dates';

function getWindowDateStart(dateStart, firstTarget) {
  if (firstTarget) {
    const diffInCycles = Math.floor(differenceInDays(dateStart, firstTarget.date_start) / firstTarget.period);
    return addDays(firstTarget.date_start, diffInCycles * firstTarget.period);
  }
  return undefined;
}

function getWindowDateEnd(dateEnd, lastTarget) {
  if (lastTarget) {
    const diffInCycles = Math.ceil(differenceInDays(dateEnd, lastTarget.date_start) / lastTarget.period);
    return addDays(lastTarget.date_start, diffInCycles * lastTarget.period + 1);
  }
  return undefined;
}

export default function Heatmap({
  dateStart,
  // FIX: I'm sending dateEnd as start of the last day in the useDatePeriod,
  //      which kind of messes with my mind
  dateEnd,
  habit,
  vertical = false,
  isOverview, // NOTE: Maybe change to is2D or is1D, much more clear this way
  overridenElimination = undefined,
  overridenNumeric = undefined,
}) {
  const data = habit?.data ?? [];
  const targets = habit?.targets ?? [];
  console.log("NEW HEATMAP STARTS HERE ====================== ", targets);
  console.log(dateEnd);

  const fti = targets.findLastIndex((t) => areAscending(new Date(t.date_start), dateStart));
  const lti = targets.findLastIndex((t) => areAscending(new Date(t.date_start), dateEnd));
  const firstTarget = targets[fti];
  const lastTarget = targets[lti];
  // console.log("targets: ", firstTarget, lastTarget);

  const windowDateStart = getWindowDateStart(dateStart, firstTarget);
  const windowDateEnd = getWindowDateEnd(dateEnd, lastTarget);
  // console.log("windows: ", windowDateStart, windowDateEnd);
  // console.log("last target date_start: ", lastTarget?.date_start);

  const habitCreatedAt = new Date(habit.created_at);
  const habitStartDate = minValidDate(habitCreatedAt, windowDateStart, targets.length > 0 && new Date(targets.length > 0 && targets[0]?.date_start));
  // console.log(habitStartDate);
  const daysToHabitStart = differenceInDays(habitStartDate, dateStart);
  console.log(habitStartDate);

  // Calculate buckets
  // TODO: Maybe remake CellPeriods to have [ ) type constaints, I'm tired of subtracting a millisecond each time

  const firstDummyBucket = daysToHabitStart > 0 ? { dateStart, dateEnd: subMilliseconds(startOfDay(habitStartDate), 1), value: 0, dummy: true } : [];
  const lastBucket = !lastTarget ? { dateStart: startOfDay(habitStartDate), dateEnd: minValidDate(dateEnd, windowDateEnd), value: 0 } : [];
  // console.log(daysToHabitStart, firstDummyBucket);
  const bucketBeforeTargetBucket = differenceInDays(targets.length && targets[0]?.date_start, habitCreatedAt) > 0 ? { dateStart: startOfDay(habitCreatedAt), dateEnd: subMilliseconds(new Date(targets[0]?.date_start), 1), value: 0 } : [];
  const targetBuckets = targets.slice(Math.max(fti, 0), lti + 1).flatMap((t, i, ts) => {
    const bucketsDateStart = new Date(t.date_start);
    const nextTarget = i + 1 < lti + 1 ? ts[i + 1] : undefined;
    const bucketsDateEnd = minValidDate(new Date(t.date_end), new Date(nextTarget?.date_start), maxValidDate(windowDateEnd, dateStart));
    // console.log("TARGET ===========", t);
    // console.log("target bucket period: ", i, bucketsDateStart, bucketsDateEnd);
    const daysUntilEnd = differenceInDays(bucketsDateEnd, new Date(t.date_start));
    let diffInCycles = Math.floor(daysUntilEnd / t.period);
    const hasFractionedCycle = daysUntilEnd % t.period;
    diffInCycles += !!hasFractionedCycle;
    console.log("diff in Cycles -> ", diffInCycles, bucketsDateEnd, t.date_start, !!hasFractionedCycle);

    return diffInCycles > 0 ? Array.from(new Array(diffInCycles)).map((_, j) => ({
      targetIndex: i + Math.max(fti, 0),
      dateStart: addDays(bucketsDateStart, t.period * j),
      dateEnd: subMilliseconds(minValidDate(addDays(bucketsDateStart, t.period * (j + 1)), new Date(nextTarget?.date_start)), 1),
    })) : [];
  })
  console.log("target buckets: ", targetBuckets);

  const buckets = [firstDummyBucket, bucketBeforeTargetBucket, targetBuckets, lastBucket].flatMap(b => b);
  console.log("buckets: ", buckets, habitCreatedAt, habit.name);

  // TODO: I want to get rid of it tbh
  const elimination = overridenElimination ?? habit?.elimination;
  const numeric = overridenNumeric ?? habit?.numeric;

  const firstDataIndex = data.findIndex((d) => areAscending(windowDateStart || dateStart, d.date));
  let j = firstDataIndex === -1 ? data.length : firstDataIndex;
  console.log("First data index: ", firstDataIndex, "][ Start from element: ", j);
  // let j = 0;

  const hasNextDataPoint = (bucket) => j < data.length ?
    areAscending(bucket.dateStart, new Date(data[j].date), bucket.dateEnd)
    : undefined;

  // Populating buckets with data and turning them into cells
  const Cells = buckets.map((b, i) => {

    // Case 1. Handle <target cells> that already have a determined dateStart, dateEnd and targetValue
    if (typeof b.targetIndex === 'number') {
      // TODO: Handling of sequences
      let value = 0;
      while (hasNextDataPoint(b)) {
        value += data[j].value;
        j += 1;
      }
      return <CellPeriod
        key={i}
        dummy={!!targets[b.targetIndex]?.isArchiving}
        habitID={habit.id}
        targetStart={b.dateStart}
        targetEnd={b.dateEnd}
        dateStart={startOfDay(max([b.dateStart, dateStart]))}
        dateEnd={endOfDay(min([b.dateEnd, dateEnd]))}
        color={habit.color}
        value={value}
        targetValue={targets[b.targetIndex].value}
        basePeriod={24}
        vertical={vertical}
        elimination={elimination}
        numeric={numeric}
        isOverview={isOverview}
      />
    }


    // Case 2. Handle <bucketed cells>
    let cell = { dateStart: max([b.dateStart, dateStart]), value: 0, dummy: b.dummy };
    const cells = [];

    let date;
    let bucketHasDataPoints = false;
    while (hasNextDataPoint(b)) {
      date = startOfDay(new Date(data[j].date));

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

      cell.value += data[j].value;
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
