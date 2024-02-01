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
} from 'date-fns';
import { CellPeriod, CellDummy } from './HeatmapCells';
import { getNumericTextColor, mixColors, hexToRgb } from '../hooks/usePaletteGenerator';

export default function Heatmap({
  dateStart,
  dateEnd,
  habit,
  heatmapData,
  heatmapID,
  vertical = false,
  isOverview,
  overridenElimination = undefined,
  overridenNumeric = undefined,
}) {
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
  let firstPassed = false;
  let archived = false;

  const dateCreation = startOfDay(new Date(habit?.date_of_creation ?? dateStart));

  const elimination = overridenElimination === undefined ? habit?.elimination : overridenElimination;
  const numeric = overridenNumeric === undefined ? habit?.numeric : overridenNumeric;

  return (
    <div
      className={`overview-habit-cells ${isOverview ? '' : 'weekly'}`}
      style={{ '--numeric-text-color': getNumericTextColor(habit.color) }}
    >
      {heatmapData &&
        heatmapData.flatMap((point, index) => {
          const date = startOfDay(new Date(point.date));
          if (compareDesc(dateEnd, date) === 1 && !passed) {
            return [];
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
            return [];
          }
          // if (index === heatmapData.length - 2 && point.is_archive) {
          //   current.date = dateEnd;
          //   return [];
          // }
          let gap;
          if (index === 0 && compareDesc(dateStart, date) === 1) {
            const dateOfFirstEntry = min([dateCreation, date]);
            gap = Math.max(differenceInDays(dateOfFirstEntry, dateStart), 0);
            current.date = dateOfFirstEntry;
          }
          let firstVerticalDummy;
          if (!firstPassed && vertical) {
            const hiddenDateStart = max([addDays(current.date, -gap || 0), dateStart]);
            firstVerticalDummy = differenceInDays(hiddenDateStart, startOfWeek(hiddenDateStart));
          }
          if (target.period === undefined) {
            const dateNowTmp = current.date;
            if (point?.is_target) {
              if (index === heatmapData.length - 2 && point.is_archive) {
                archived = true;
              }
              setNewTarget(point, date);
            } else {
              current.date = addDays(date, 1);
            }
            firstPassed = true;
            return (
              <React.Fragment key={index}>
                {!!firstVerticalDummy && (
                  <CellDummy length={firstVerticalDummy} vertical={vertical} />
                )}
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
                    heatmapID={heatmapID}
                    dateStart={max([dateNowTmp, dateStart])}
                    dateEnd={subMilliseconds(addDays(date, point?.isLast || 0), 1)}
                    color="transparent"
                    value={0}
                    vertical={vertical}
                    elimination={elimination}
                    numeric={numeric}
                    isOverview={isOverview}
                  />
                )}
                {!point?.isLast && !point.is_target && (
                  <CellPeriod
                    heatmapID={heatmapID}
                    dateStart={date}
                    dateEnd={endOfDay(date)}
                    color={habit.color}
                    value={point.value}
                    basePeriod={24}
                    vertical={vertical}
                    elimination={elimination}
                    numeric={numeric}
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
          if (passed && index === heatmapData.length - 1) {
            passed = false;
            diffInPeriods = 1;
            if (compareDesc(date, addDays(current.date, target.period)) === 1) {
              previous.value += point.value;
            }
          }
          if (index === heatmapData.length - 2 && point.is_archive) {
            // current.date = dateEnd;
            archived = true;
          }
          if (passed && compareDesc(addDays(current.date, target.period), date) === 1) {
            passed = false;
            diffInPeriods = 1;
          }
          if (passed && diffInPeriods) {
            passed = false;
          }
          if (point?.isLast) {
            if (archived) {
              diffInPeriods = 1;
              previousTarget.period = differenceInDays(date, previous.date);
              return (isOverview ? (
                <CellDummy key={index} length={gap} vertical={vertical} />
              ) : (
                <CellPeriod
                  key={index}
                  dateStart={previous.date}
                  dateEnd={date}
                  dummy
                />
              ));
            }
            if (index === heatmapData.length - 1) {
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
          firstPassed = true;
          return (
            <React.Fragment key={index}>
              {!!firstVerticalDummy && (
                <CellDummy length={firstVerticalDummy} vertical={vertical} />
              )}
              {Array.from(new Array(diffInPeriods)).map((_, Index) => (
                <CellPeriod
                  heatmapID={heatmapID}
                  key={Index}
                  targetStart={addDays(previous.date, Index * previousTarget.period)}
                  targetEnd={subMilliseconds(
                    addDays(previous.date, (Index + 1) * previousTarget.period),
                    1,
                  )}
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
                  color={Index || !previous.value ? 'transparent' : habit.color}
                  value={Index ? 0 : previous.value}
                  basePeriod={24}
                  vertical={vertical}
                  elimination={elimination}
                  numeric={numeric}
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
