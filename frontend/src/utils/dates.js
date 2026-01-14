import { formatISO, addDays, compareDesc } from 'date-fns';

function getISODate(date) {
  return formatISO(date, { representation: 'date' });
}

function getUTCOffsettedDate(date = new Date()) {
  return formatISO(addDays(date, new Date().getTimezoneOffset() > 0 * 1), {
    representation: 'date',
  });
}

function areAscending(...dates) {
  return dates.reduce(
    (ascending, date, i) => ascending && (i === 0 || compareDesc(dates[i - 1], date) >= 0),
    true,
  );
}

export { getISODate, getUTCOffsettedDate, areAscending };
