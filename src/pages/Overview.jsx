import React from 'react';
import { useGetSettingsQuery } from '../state/services/settings';
import useDatePeriod, { getAdaptivePeriodLength } from '../hooks/useDatePeriod';
import Overview from '../components/Overview';
import useTitle from '../hooks/useTitle';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { DatePeriodPicker } from '../components/DatePickers';

export default function Dashboard() {
  useTitle('Overview | Neohabit');
  const settings = useGetSettingsQuery();

  const { width } = useWindowDimensions();
  const { adaptiveDatePeriodLength, mobile } = getAdaptivePeriodLength(width);
  const datePeriodLength =
    settings.data?.overview_adaptive ?? true
      ? Math.min(
          adaptiveDatePeriodLength,
          settings.data?.overview_apply_limit ?? true
            ? settings.data?.overview_duration_limit ?? 32
            : Infinity,
        )
      : settings.data?.overview_duration ?? 32;

  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, subPeriod, addPeriod, setToPast, setToFuture, reset },
  ] = useDatePeriod(datePeriodLength, true);

  if (settings.isFetching) {
    return <div className="loader" />;
  }

  return (
    <>
      <div className="contentlist-controls only-datepicker">
        <DatePeriodPicker
          dateStart={dateStart}
          setDateStart={setDateStart}
          dateEnd={dateEnd}
          setDateEnd={setDateEnd}
          subPeriod={subPeriod}
          addPeriod={addPeriod}
          setToPast={setToPast}
          reset={reset}
          setToFuture={setToFuture}
        />
      </div>
      <div className="contentlist">
        <Overview
          dateStart={dateStart}
          dateEnd={dateEnd}
          mobile={mobile}
          addPeriod={addPeriod}
          subPeriod={subPeriod}
          addYear={addYear}
          subYear={subYear}
        />
      </div>
    </>
  );
}
