import { formatISO } from 'date-fns';

function getISODate(date) {
  return formatISO(date, { representation: 'date' });
}

export { getISODate };
