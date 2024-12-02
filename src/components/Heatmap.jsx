import React, { useState, useEffect } from 'react';
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
import { getNumericTextColor } from '../hooks/usePaletteGenerator';
import { heatmapSort } from '../utils/heatmap';

export default function Heatmap({
  dateStart,
  dateEnd,
  habit,
  heatmap,
  // heatmapData,
  heatmapTargets,
  heatmapID,
  vertical = false,
  isOverview,
  overridenElimination = undefined,
  overridenNumeric = undefined,
}) {
  const firstPeriodTarget = heatmapTargets.findLast((point) => compareDesc(startOfDay(new Date(point.date)), dateStart) === 1);
  const lastPeriodTarget = heatmapTargets.find((point) => compareDesc(startOfDay(new Date(point.date)), dateEnd) === 1);
  const [heatmapData, setHeatmapData] = useState(heatmapSort(heatmap?.data, dateEnd));

  useEffect(() => {
    setHeatmapData(heatmapSort(heatmap?.data, dateEnd));
  }, [heatmap?.data])

  const current = { date: dateStart, values: [0] };
  // current.date === current Target Period Start if period is defined,
  // otherwise it's the current date
  // current.values always has one value if it's not a sequence
  // otherwise it's an array of the amount of items in a sequence
  const target = { start: undefined, period: undefined, value: 1, sequence: [] };
  const getCellPositionInSequence = (mod) => {
    if (!target.sequence.length) return 0;
    let curMod = mod;
    let index = 0;
    for (let i = 0; i < target.sequence.length; i++) {
      const currentTarget = target.sequence[i];
      if (curMod > currentTarget.duration) {
        curMod -= currentTarget.duration;
        index += Math.floor(currentTarget.duration / currentTarget.period);
        continue;
      }
      index += Math.floor(curMod / currentTarget.period);
      break;
    }
    return index;
  };
  const setNewTarget = (point, date) => {
    target.period = point.period;
    target.value = point.value;
    target.start = date;
    target.sequence = [];
    current.date = date;
    current.values = target.sequence.length
      ? new Array(getCellPositionInSequence(target.period)).fill(0)
      : [0];
  };
  let passed = false;
  let firstPassed = false;
  let archived = false;

  const dateCreation = startOfDay(new Date(habit?.date_of_creation ?? dateStart));

  const elimination = overridenElimination ?? habit?.elimination;
  const numeric = overridenNumeric ?? habit?.numeric;

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
              const valueIndex = getCellPositionInSequence(
                differenceInDays(date, current.date) % target.period,
              );
              if (diffInPeriods === 0) {
                current.values[valueIndex] += point.value;
              } else {
                current.date = addDays(current.date, diffInPeriods * target.period);
                current.values[valueIndex] = point.value;
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
            current.values[0] = 0;
          }
          const previous = { ...current, values: current.values.slice() };
          const previousTarget = {
            ...target,
            sequence: target.sequence.length
              ? target.sequence.slice()
              : [{ ...target, duration: target.period, start: 0 }],
          };
          let diffInPeriods = Math.floor(differenceInDays(date, current.date) / target.period);
          const valueIndex = getCellPositionInSequence(
            differenceInDays(date, current.date) % target.period,
          );
          if (passed && index === heatmapData.length - 1) {
            passed = false;
            diffInPeriods = 1;
            if (compareDesc(date, addDays(current.date, target.period)) === 1) {
              previous.values[valueIndex] += point.value;
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
              return isOverview ? (
                <CellDummy key={index} length={gap} vertical={vertical} />
              ) : (
                <CellPeriod key={index} dateStart={previous.date} dateEnd={date} dummy />
              );
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
            current.values[valueIndex] += point.value;
            return <React.Fragment key={index}> </React.Fragment>;
          } else {
            current.date = addDays(current.date, diffInPeriods * target.period);
            current.values[valueIndex] = point.value;
          }
          firstPassed = true;
          return (
            <React.Fragment key={index}>
              {!!firstVerticalDummy && (
                <CellDummy length={firstVerticalDummy} vertical={vertical} />
              )}
              {Array.from(new Array(diffInPeriods)).map((_, Index) => (
                <React.Fragment key={`${index}-${Index}`}>
                  {Array.from(new Array(previousTarget.sequence.length)).map(
                    (__, sequenceIndex) => {
                      const sequenceTarget = previousTarget.sequence[sequenceIndex];
                      return (
                        <React.Fragment key={`${index}-${Index}-${sequenceIndex}`}>
                          {Array.from(
                            new Array(Math.floor(sequenceTarget.duration / sequenceTarget.period)),
                          ).map((___, sequencePeriodIndex) => {
                            const targetStart = addDays(
                              previous.date,
                              previousTarget.period * Index +
                                sequenceTarget.start +
                                sequenceTarget.period * sequencePeriodIndex,
                            );
                            const targetEnd = addDays(
                              previous.date,
                              previousTarget.period * Index +
                                sequenceTarget.start +
                                sequenceTarget.period * (sequencePeriodIndex + 1),
                            );
                            return (
                              <CellPeriod
                                heatmapID={heatmapID}
                                key={`${index}-${Index}-${sequenceIndex}-${sequencePeriodIndex}`}
                                targetStart={targetStart}
                                targetEnd={subMilliseconds(targetEnd, 1)}
                                dateStart={max([targetStart, dateStart])}
                                dateEnd={subMilliseconds(
                                  min([targetEnd, addDays(dateEnd, 1), current.date]),
                                  1,
                                )}
                                color={Index || !previous.values[0] ? 'transparent' : habit.color}
                                value={Index ? 0 : previous.values[0]}
                                basePeriod={24}
                                vertical={vertical}
                                elimination={elimination}
                                numeric={numeric}
                                targetValue={sequenceTarget.value}
                                isOverview={isOverview}
                                dummy={!sequenceTarget.value}
                              />
                            );
                          })}
                        </React.Fragment>
                      );
                    },
                  )}
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        })}
    </div>
  );
}
