import { formatISO, addDays } from 'date-fns';

function getISODate(date) {
  return formatISO(date, { representation: 'date' });
}

function getUTCOffsettedDate(date = new Date()) {
  return formatISO(addDays(date, new Date().getTimezoneOffset() > 0 * 1), {
    representation: 'date',
  });
}

export { getISODate, getUTCOffsettedDate };
