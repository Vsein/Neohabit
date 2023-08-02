import React from 'react';
import {
  differenceInDays,
  addDays,
  compareDesc,
  startOfDay,
  endOfDay,
  min,
  subMilliseconds,
} from 'date-fns';
import { CellPeriod, CellDummy } from './HeatmapCells';
import usePaletteGenerator from '../hooks/usePaletteGenerator';

export default function OverviewHeatmap({
  dateStart,
  dateEnd,
  project,
  heatmap,
  useElimination = true,
}) {
  const data = heatmap?.data;
  let dataSorted;
  if (data) {
    dataSorted = [...data, { date: endOfDay(dateEnd), value: undefined, isLast: 1 }];
    dataSorted.sort((a, b) => compareDesc(new Date(b.date), new Date(a.date)));
  }
  const current = { date: dateStart, targetPeriod: undefined, targetValue: 1, value: 0 };
  const palette = usePaletteGenerator(project.color);
  const dateCreation = startOfDay(new Date(project?.date_of_creation ?? dateStart));

  return (
    <div
      className="overview-project-cells"
      style={{ '--cell-height': '15px', '--cell-width': '15px' }}
    >
      {dataSorted && dataSorted.map((point, index) => {
        const date = startOfDay(new Date(point.date));
        if (compareDesc(dateEnd, date) === 1) {
          return <> </>;
        }
        if (compareDesc(date, dateStart) === 1) {
          if (point?.is_target) {
            current.targetPeriod = point.period;
            current.targetValue = point.value;
          }
          return <> </>;
        }
        let gap;
        if (index === 0 && compareDesc(dateStart, date) === 1) {
          const dateOfFirstEntry = min([dateCreation, date]);
          gap = Math.max(differenceInDays(dateOfFirstEntry, dateStart), 0);
          current.date = dateOfFirstEntry;
        }
        if (current.targetPeriod === undefined) {
          const dateNowTmp = current.date;
          current.date = addDays(date, 1);
          return (
            <>
              {gap > 0 && <CellDummy key={index} length={gap} vertical={false} />}
              {(differenceInDays(date, dateNowTmp) > 0
                  || (point?.isLast && compareDesc(dateNowTmp, date) >= 0 && !gap))
                  && <CellPeriod
                    dateStart={dateNowTmp}
                    dateEnd={subMilliseconds(addDays(date, point?.isLast || 0), 1)}
                    color={palette[0]}
                    value={0}
                    vertical={false}
                  />
                }
              {!point?.isLast && !point.is_target
                  && <CellPeriod
                    dateStart={date}
                    dateEnd={endOfDay(date)}
                    color={project.color}
                    value={point.value}
                    basePeriod={24}
                    vertical={false}
                  />
              }
            </>
          );
        }
        const first = { ...current };
        const diffInPeriods = Math.floor(differenceInDays(date, current.date) / first.targetPeriod)
          + (point?.isLast || 0);
        current.date = addDays(first.date, diffInPeriods * first.targetPeriod);
        if (point?.is_target) {
          current.targetPeriod = point.period;
          current.targetValue = point.value;
          current.value = 0;
        } else {
          current.value = point.value;
        }
        return Array.from(new Array(diffInPeriods)).map((_, Index) => (
          <CellPeriod
            key={Index}
            dateStart={addDays(first.date, Index * first.targetPeriod)}
            dateEnd={subMilliseconds(min([
              addDays(first.date, (Index + 1) * first.targetPeriod),
              addDays(dateEnd, 1)]), 1)}
            color={Index || !first.value ? palette[0] : project.color}
            value={Index ? 0 : first.value}
            basePeriod={24}
            vertical={false}
          />
        ));
      })}
    </div>
  );
}
