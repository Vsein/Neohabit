import React from 'react';
import useDatePeriod, { useGetDatePeriodLength } from '../hooks/useDatePeriod';
import Overview from '../components/Overview';
import useTitle from '../hooks/useTitle';
import { DatePeriodPicker } from '../components/DatePickers';

export default function OverviewPage() {
  useTitle('Overview | Neohabit');
  const { datePeriodLength, mobile } = useGetDatePeriodLength();

  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subYear, addYear, subPeriod, addPeriod, setToPast, setToFuture, reset, isPastPeriod, isFuturePeriod },
  ] = useDatePeriod(datePeriodLength, true);

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
          mobile={mobile}
          isPastPeriod={isPastPeriod}
          isFuturePeriod={isFuturePeriod}
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
