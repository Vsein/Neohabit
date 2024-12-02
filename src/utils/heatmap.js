import { compareDesc, startOfDay, endOfDay } from 'date-fns';

function heatmapSort(data, dateEnd) {
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
  return dataSorted;
}

function isHabitArchived(targetsSorted, dateStart, dateEnd) {
  return (
    (new Date(targetsSorted[0].date).getTime() === endOfDay(dateEnd).getTime() &&
      targetsSorted.length !== 1) ||
    (targetsSorted.length > 2 &&
      targetsSorted[targetsSorted.length - 2].is_archive &&
      startOfDay(new Date(targetsSorted[targetsSorted.length - 2].date).getTime()) <=
        dateStart.getTime())
  );
}

export { heatmapSort, isHabitArchived };
