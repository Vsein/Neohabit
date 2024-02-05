import React from 'react';
import { useDispatch } from 'react-redux';
import { changeTo } from '../state/features/overlay/overlaySlice';
import useDatePeriod, { useGetDatePeriodLength } from '../hooks/useDatePeriod';
import { DatePeriodPicker } from '../components/DatePickers';
import Projectlist from '../components/Projectlist';
import useTitle from '../hooks/useTitle';

export default function ProjectsPage() {
  useTitle('Projects | Neohabit');
  const vertical = false;

  const dispatch = useDispatch();
  const openOverlay = () => {
    dispatch(changeTo({ projectID: '', type: 'project' }));
  };

  const { datePeriodLength, mobile } = useGetDatePeriodLength();

  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, subPeriod, addPeriod, setToPast, setToFuture, reset },
  ] = useDatePeriod(datePeriodLength, true);

  return (
    <>
      <div className="contentlist-controls">
        <div className="overview-centering" style={{ width: 'max-content' }}>
          <button
            className={`overview-habit-add standalone topbar ${vertical ? 'vertical' : ''}`}
            onClick={openOverlay}
            title="Add a new project"
          >
            <p>New project</p>
          </button>
        </div>
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
      <Projectlist
        datePeriodLength={datePeriodLength}
        mobile={mobile}
        dateStart={dateStart}
        dateEnd={dateEnd}
        subPeriod={subPeriod}
        addPeriod={addPeriod}
      />
    </>
  );
}
