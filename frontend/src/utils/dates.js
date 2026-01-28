import { formatISO, addDays, compareDesc, min, max, isValid } from 'date-fns';

function formatDate(date) {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    // The below are needed only for dev stage, I'm thinking of hiding
    // the time and whatnot if the period starts exactly at 0:00.
    // And it's also kinda sucky to use US locale. With all those AMs
    // ans PMs it gets pretty ambiguous quickly.
    weekday: 'short',
  });
}

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

export { formatDate, getISODate, getUTCOffsettedDate, areAscending, minValidDate, maxValidDate };
