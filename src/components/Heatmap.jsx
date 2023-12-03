import React from 'react';
import {
  differenceInDays,
  addDays,
  compareDesc,
  startOfDay,
  endOfDay,
  min,
  max,
  subMilliseconds,
} from 'date-fns';
import { CellPeriod, CellDummy } from './HeatmapCells';
import usePaletteGenerator from '../hooks/usePaletteGenerator';

export default function Heatmap({
  dateStart,
  dateEnd,
  habit,
  heatmap,
  vertical = false,
  isOverview,
}) {
  const data = heatmap?.data;
  let dataSorted;
  if (data) {
    dataSorted = [...data, { date: endOfDay(dateEnd), value: 0, isLast: 1 }];
    dataSorted.sort((a, b) => {
      const res = compareDesc(new Date(b.date), new Date(a.date));
      if (res === 0) {
        return -2 * a.is_target + 1;
      }
      return res;
    });
  }
  const current = { date: dateStart, value: 0 };
  // current.date === current Target Period Start if period is defined,
  // otherwise it's the current date
  const target = { start: undefined, period: undefined, value: 1 };
  const setNewTarget = (point, date) => {
    target.period = point.period;
    target.value = point.value;
    target.start = date;
    current.date = date;
    current.value = 0;
  };
  let passed = false;

  const palette = usePaletteGenerator(habit.color);
  const dateCreation = startOfDay(new Date(habit?.date_of_creation ?? dateStart));

  return (
    <div className={`overview-habit-cells ${isOverview ? '' : 'weekly'}`}>
      {dataSorted &&
        dataSorted.map((point, index) => {
          const date = startOfDay(new Date(point.date));
          if (compareDesc(dateEnd, date) === 1 && !passed) {
            return <React.Fragment key={index}> </React.Fragment>;
          }
          if (compareDesc(date, dateStart) === 1) {
            if (point?.is_target) {
              setNewTarget(point, date);
            } else if (target.period) {
              const diffInPeriods = Math.floor(
                differenceInDays(date, current.date) / target.period,
              );
              if (diffInPeriods === 0) {
                current.value += point.value;
              } else {
                current.date = addDays(current.date, diffInPeriods * target.period);
                current.value = point.value;
              }
            }
            return <React.Fragment key={index}> </React.Fragment>;
          }
          let gap;
          if (index === 0 && compareDesc(dateStart, date) === 1) {
            const dateOfFirstEntry = min([dateCreation, date]);
            gap = Math.max(differenceInDays(dateOfFirstEntry, dateStart), 0);
            current.date = dateOfFirstEntry;
          }
          if (target.period === undefined) {
            const dateNowTmp = current.date;
            if (point?.is_target) {
              setNewTarget(point, date);
            } else {
              current.date = addDays(date, 1);
            }
            return (
              <React.Fragment key={index}>
                {gap > 0 &&
                  (isOverview ? (
                    <CellDummy length={gap} vertical={vertical} />
                  ) : (
                    <CellPeriod
                      dateStart={addDays(dateNowTmp, -gap)}
                      dateEnd={subMilliseconds(dateNowTmp, 1)}
                      dummy
                    />
                  ))}
                {(differenceInDays(date, dateNowTmp) > 0 ||
                  (point?.isLast && compareDesc(dateNowTmp, date) >= 0 && !gap)) && (
                  <CellPeriod
                    heatmapID={heatmap?._id}
                    dateStart={max([dateNowTmp, dateStart])}
                    dateEnd={subMilliseconds(addDays(date, point?.isLast || 0), 1)}
                    color={palette[0]}
                    value={0}
                    vertical={vertical}
                    elimination={habit?.elimination}
                    numeric={habit?.numeric}
                    isOverview={isOverview}
                  />
                )}
                {!point?.isLast && !point.is_target && (
                  <CellPeriod
                    heatmapID={heatmap?._id}
                    dateStart={date}
                    dateEnd={endOfDay(date)}
                    color={habit.color}
                    value={point.value}
                    basePeriod={24}
                    vertical={vertical}
                    elimination={habit?.elimination}
                    numeric={habit?.numeric}
                    isOverview={isOverview}
                  />
                )}
              </React.Fragment>
            );
          }
          const periodsToStart = Math.floor(
            differenceInDays(dateStart, current.date) / target.period,
          );
          if (periodsToStart > 0) {
            current.date = addDays(current.date, periodsToStart * target.period);
            current.value = 0;
          }
          const previous = { ...current };
          const previousTarget = { ...target };
          let diffInPeriods = Math.floor(differenceInDays(date, current.date) / target.period);
          if (passed && index === dataSorted.length - 1) {
            passed = false;
            diffInPeriods = 1;
            if (compareDesc(date, addDays(current.date, target.period)) === 1) {
              previous.value += point.value;
            }
          }
          if (passed && compareDesc(addDays(current.date, target.period), date) === 1) {
            passed = false;
            diffInPeriods = 1;
          }
          if (passed && diffInPeriods) {
            passed = false;
          }
          if (point?.isLast) {
            if (index === dataSorted.length - 1) {
              diffInPeriods += 1;
            } else {
              passed = true;
            }
          }
          if (point?.is_target) {
            if (differenceInDays(date, current.date) % target.period) {
              diffInPeriods += 1;
            }
            setNewTarget(point, date);
          } else if (diffInPeriods === 0) {
            current.value += point.value;
            return <React.Fragment key={index}> </React.Fragment>;
          } else {
            current.date = addDays(current.date, diffInPeriods * target.period);
            current.value = point.value;
          }
          return (
            <React.Fragment key={index}>
              {Array.from(new Array(diffInPeriods)).map((_, Index) => (
                <CellPeriod
                  heatmapID={heatmap?._id}
                  key={Index}
                  targetStart={addDays(previous.date, Index * previousTarget.period)}
                  targetEnd={subMilliseconds(addDays(previous.date, (Index + 1) * previousTarget.period), 1)}
                  dateStart={max([
                    addDays(previous.date, Index * previousTarget.period),
                    dateStart,
                  ])}
                  dateEnd={subMilliseconds(
                    min([
                      addDays(previous.date, (Index + 1) * previousTarget.period),
                      addDays(dateEnd, 1),
                      current.date,
                    ]),
                    1,
                  )}
                  color={Index || !previous.value ? palette[0] : habit.color}
                  value={Index ? 0 : previous.value}
                  basePeriod={24}
                  vertical={vertical}
                  elimination={habit?.elimination}
                  numeric={habit?.numeric}
                  targetValue={previousTarget.value}
                  isOverview={isOverview}
                />
              ))}
            </React.Fragment>
          );
        })}
    </div>
  );
}
