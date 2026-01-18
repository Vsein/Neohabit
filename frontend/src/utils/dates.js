import { formatISO, addDays, compareDesc, min, max, isValid } from 'date-fns';

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

function minValidDate(...dates) {
  return min(dates.filter((d) => isValid(d)));
}

function maxValidDate(...dates) {
  return max(dates.filter((d) => isValid(d)));
}

export { getISODate, getUTCOffsettedDate, areAscending, minValidDate, maxValidDate };
