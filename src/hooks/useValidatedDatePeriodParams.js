import { useSearchParams } from 'react-router-dom';
import { startOfDay } from 'date-fns';
import { getISODate } from '../utils/dates';

export default function useValidatedDatePeriodParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const dateStartRawURL = searchParams.get('from');
  const dateStartURL = startOfDay(new Date(dateStartRawURL));
  const dateStartError = getISODate(dateStartURL) !== dateStartRawURL;

  if (dateStartRawURL && dateStartError) {
    searchParams.delete('from');
    setSearchParams(searchParams);
  }

  const dateEndRawURL = searchParams.get('to');
  const dateEndURL = startOfDay(new Date(dateEndRawURL));
  const dateEndError = getISODate(dateEndURL) !== dateEndRawURL;

  if (dateEndRawURL && dateEndError) {
    searchParams.delete('to');
    setSearchParams(searchParams);
  }

  return {
    dateStartURL: dateStartError ? undefined : dateStartURL,
    dateEndURL: dateEndError ? undefined : dateEndURL,
  };
}
