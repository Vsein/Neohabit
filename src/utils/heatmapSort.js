import { compareDesc, endOfDay } from 'date-fns';

export default function sortHeatmapData(data, dateEnd) {
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
