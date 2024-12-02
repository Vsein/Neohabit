import { compareDesc, startOfDay, endOfDay } from 'date-fns';

function heatmapSort(data, dateEnd) {
  let dataSorted;
  if (data) {
    dataSorted = [...data];
    // dataSorted = [...data, { date: endOfDay(dateEnd), value: 0, isLast: 1 }];
    dataSorted.sort((a, b) => {
      const res = compareDesc(new Date(b.date), new Date(a.date));
      if (res === 0) {
        return -2 * a.is_target + 1;
      }
      return res;
    });
  }
  return dataSorted;
}

function isHabitArchived(targetsSorted, dateStart, dateEnd) {
  const firstPeriodTarget = targetsSorted.findLast(
    (point) => compareDesc(startOfDay(new Date(point.date)), dateStart) === 1,
  );
  const lastPeriodTarget = targetsSorted.findLast(
    (point) => compareDesc(startOfDay(new Date(point.date)), dateEnd) === 1,
  );

  return firstPeriodTarget?.is_archive || !lastPeriodTarget;
}

export { heatmapSort, isHabitArchived };
