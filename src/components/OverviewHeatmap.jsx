import React from 'react';
import {
  differenceInDays,
  addDays,
  compareAsc,
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
  useElimination = true,
}) {
  const dateCreation = new Date(project?.date_of_creation ?? dateStart);
  if (min([dateCreation, dateEnd]) === dateEnd) {
    return <> </>;
  }
  let dateNow = max([dateStart, startOfDay(dateCreation)]);
  const gap = differenceInDays(dateNow, dateStart);
  const data = heatmap?.data;
  let dataSorted;
  if (data) {
    dataSorted = [...data];
    dataSorted.sort((a, b) => compareAsc(new Date(a.date), new Date(b.date)));
  }
  const target = { is_target: false, date: undefined, value: 0, period: 0 };

  const palette = usePaletteGenerator(project.color);

  return (
    <div
      className="overview-project-cells"
      style={{ '--cell-height': '15px', '--cell-width': '15px' }}
    >
      {gap > 0 && <CellDummy length={gap} vertical={false} />}
      {dataSorted &&
        dataSorted.map((point, index) => {
          const date = startOfDay(new Date(point.date));
          if (point?.is_target && differenceInDays(dateStart, date) > -30) {
            const tmpPeriod = target.period;
            const tmpValue = target.currentValue;
            Object.assign(target, point);
            target.currentValue = 0;
            target.currentDateStart = max([date, dateStart]);
            return differenceInDays(date, dateNow) > 0 ? (
              <>
                <CellPeriod
                  key={index}
                  dateStart={dateNow}
                  dateEnd={subMilliseconds(addDays(dateNow, tmpPeriod), 1)}
                  color={tmpValue ? project.color : palette[0]}
                  value={tmpValue}
                  basePeriod={24}
                  vertical={false}
                />
                {Array.from(new Array(differenceInDays(date, dateNow) - 1)).map(
                  (_, Index) => (
                    <CellPeriod
                      key={Index}
                      dateStart={addDays(dateNow, (Index + 1) * tmpPeriod)}
                      dateEnd={subMilliseconds(
                        addDays(dateNow, (Index + 2) * tmpPeriod),
                        1,
                      )}
                      color={palette[0]}
                      value={0}
                      basePeriod={24}
                      vertical={false}
                    />
                  ),
                )}
              </>
            ) : (
              <> </>
            );
          }
          if (differenceInDays(dateEnd, new Date(point.date)) < 0) {
            return <> </>;
          }
          if (!target.is_target) {
            const dateNowTmp = dateNow;
            const gap = differenceInDays(date, dateNow);
            if (gap < 0) return <> </>;
            dateNow = addDays(date, 1);
            return (
              <>
                {gap > 0 ? (
                  <CellPeriod
                    dateStart={dateNowTmp}
                    dateEnd={subMilliseconds(date, 1)}
                    color={palette[0]}
                    value={0}
                    vertical={false}
                  />
                ) : (
                  <> </>
                )}
                <CellPeriod
                  dateStart={date}
                  dateEnd={endOfDay(date)}
                  color={project.color}
                  value={point.value}
                  basePeriod={24}
                  vertical={false}
                />
              </>
            );
          }
          const gap = differenceInDays(date, target.currentDateStart);
          if (gap >= target.period) {
            const diffInPeriods = Math.floor(gap / target.period);
            const firstDate = target.currentDateStart;
            const firstValue = target.currentValue;
            const firstColor = target.currentValue ? project.color : palette[0];
            target.currentValue = point.value;
            target.currentDateStart = addDays(
              firstDate,
              diffInPeriods * target.period,
            );
            dateNow = target.currentDateStart;
            return Array.from(new Array(diffInPeriods)).map((_, index) => (
              <CellPeriod
                key={index}
                dateStart={addDays(firstDate, index * target.period)}
                dateEnd={subMilliseconds(
                  addDays(firstDate, (index + 1) * target.period),
                  1,
                )}
                color={index ? palette[0] : firstColor}
                value={index ? 0 : firstValue}
                basePeriod={24}
                vertical={false}
              />
            ));
          }
          if (gap >= 0 && gap <= target.period) {
            target.currentValue += point.value;
          }
        })}
      {differenceInDays(addDays(dateEnd, 1), dateNow) > 0 &&
        !target.is_target && (
          <CellPeriod
            dateStart={dateNow}
            dateEnd={subMilliseconds(addDays(dateEnd, 1), 1)}
            color={palette[0]}
            value={0}
            basePeriod={24}
            vertical={false}
          />
        )}
      {target.is_target && (
        <>
          <CellPeriod
            dateStart={target.currentDateStart}
            dateEnd={subMilliseconds(
              addDays(target.currentDateStart, target.period),
              1,
            )}
            color={target.currentValue ? project.color : palette[0]}
            value={target.currentValue}
            basePeriod={24}
            vertical={false}
          />
          {Array.from(
            new Array(
              Math.floor(
                differenceInDays(
                  addDays(dateEnd, 1),
                  addDays(target.currentDateStart, target.period),
                ) / target.period,
              ),
            ),
          ).map((_, index) => (
            <CellPeriod
              key={index}
              dateStart={addDays(
                target.currentDateStart,
                (index + 1) * target.period,
              )}
              dateEnd={subMilliseconds(
                addDays(target.currentDateStart, (index + 2) * target.period),
                1,
              )}
              color={palette[0]}
              value={0}
              basePeriod={24}
              vertical={false}
            />
          ))}
        </>
      )}
    </div>
  );
}
