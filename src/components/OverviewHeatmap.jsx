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

export default function OverviewHeatmap({
  dateStart,
  dateEnd,
  project,
  heatmap,
  vertical = false,
}) {
  const data = heatmap?.data;
  let dataSorted;
  if (data) {
    dataSorted = [...data, { date: endOfDay(dateEnd), value: undefined, isLast: 1 }];
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
  const palette = usePaletteGenerator(project.color);
  const dateCreation = startOfDay(new Date(project?.date_of_creation ?? dateStart));

  return (
    <div className="overview-project-cells">
      {dataSorted &&
        dataSorted.map((point, index) => {
          const date = startOfDay(new Date(point.date));
          if (compareDesc(dateEnd, date) === 1) {
            return <> </>;
          }
          if (compareDesc(date, dateStart) === 1) {
            if (point?.is_target) {
              target.period = point.period;
              target.value = point.value;
              target.start = date;
              current.date = date;
              current.value = 0;
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
            return <> </>;
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
              target.period = point.period;
              target.value = point.value;
              target.start = date;
              current.date = date;
              current.value = 0;
            } else {
              current.date = addDays(date, 1);
            }
            return (
              <>
                {gap > 0 && <CellDummy key={index} length={gap} vertical={vertical} />}
                {(differenceInDays(date, dateNowTmp) > 0 ||
                  (point?.isLast && compareDesc(dateNowTmp, date) >= 0 && !gap)) && (
                  <CellPeriod
                    dateStart={dateNowTmp}
                    dateEnd={subMilliseconds(addDays(date, point?.isLast || 0), 1)}
                    color={palette[0]}
                    value={0}
                    vertical={vertical}
                    elimination={project?.elimination}
                  />
                )}
                {!point?.isLast && !point.is_target && (
                  <CellPeriod
                    dateStart={date}
                    dateEnd={endOfDay(date)}
                    color={project.color}
                    value={point.value}
                    basePeriod={24}
                    vertical={vertical}
                    elimination={project?.elimination}
                  />
                )}
              </>
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
          let diffInPeriods =
            Math.floor(differenceInDays(date, current.date) / target.period) + (point?.isLast || 0);
          if (point?.is_target) {
            if (differenceInDays(date, current.date) % target.period) {
              diffInPeriods += 1;
            }
            target.period = point.period;
            target.value = point.value;
            target.start = date;
            current.date = date;
            current.value = 0;
          } else if (diffInPeriods === 0) {
            current.value += point.value;
            return <> </>;
          } else {
            current.date = addDays(current.date, diffInPeriods * target.period);
            current.value = point.value;
          }
          return Array.from(new Array(diffInPeriods)).map((_, Index) => (
            <CellPeriod
              key={Index}
              targetStart={addDays(previous.date, Index * previousTarget.period)}
              dateStart={max([addDays(previous.date, Index * previousTarget.period), dateStart])}
              dateEnd={subMilliseconds(
                min([
                  addDays(previous.date, (Index + 1) * previousTarget.period),
                  addDays(dateEnd, 1),
                  current.date,
                ]),
                1,
              )}
              color={Index || !previous.value ? palette[0] : project.color}
              blankColor={palette[0]}
              value={Index ? 0 : previous.value}
              basePeriod={24}
              vertical={vertical}
              elimination={project?.elimination}
              targetValue={previousTarget.value}
            />
          ));
        })}
    </div>
  );
}
