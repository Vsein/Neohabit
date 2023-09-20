import React from 'react';
import Icon from '@mdi/react';
import { formatISO, startOfDay, getYear } from 'date-fns';
import {
  mdiMenuLeft,
  mdiMenuRight,
  mdiCalendarEnd,
  mdiCalendarStart,
  mdiCalendarRefresh,
} from '@mdi/js';

function YearPicker({ subYear, addYear, dateStart }) {
  return (
    <div className="overview-year-move">
      <button className="centering" onClick={subYear}>
        <Icon path={mdiMenuLeft} className="icon" />
      </button>
      <h3>{getYear(dateStart)}</h3>
      <button className="centering left" onClick={addYear}>
        <Icon path={mdiMenuRight} className="icon" />
      </button>
    </div>
  );
}

function DatePeriodPicker({ setDateStart, dateStart, setDateEnd, dateEnd, addPeriod, subPeriod }) {
  return (
    <div className="dates-container">
      <button className="centering" onClick={subPeriod}>
        <Icon path={mdiMenuLeft} className="icon" />
      </button>
      <div className="dates-period">
        <input
          type="date"
          value={formatISO(dateStart, { representation: 'date' })}
          max="<?= date('Y-m-d'); ?>"
          rows="1"
          className="dates-period-picker"
          onChange={(e) => setDateStart(startOfDay(new Date(e.target.value)))}
        />
        -
        <input
          type="date"
          value={formatISO(dateEnd, { representation: 'date' })}
          max="<?= date('Y-m-d'); ?>"
          rows="1"
          className="dates-period-picker"
          onChange={(e) => setDateEnd(startOfDay(new Date(e.target.value)))}
        />
      </div>
      <button className="centering left" onClick={addPeriod}>
        <Icon path={mdiMenuRight} className="icon" />
      </button>
    </div>
  );
}

function DatePeriodControls({
  vertical,
  subYear,
  addYear,
  dateStart,
  addMonth,
  setToPast,
  reset,
  setToFuture,
}) {
  return (
    <div className="overview-topbar-right">
      {vertical ? (
        <YearPicker subYear={subYear} addYear={addYear} dateStart={dateStart} />
      ) : (
        <button className="centering" onClick={addMonth} title="Move month to the right [L]">
          <Icon path={mdiMenuRight} className="icon" />
        </button>
      )}
      <button
        className="overview-period-end"
        onClick={setToPast}
        title="Set today as the period end"
      >
        <Icon path={mdiCalendarEnd} className="icon small centering" />
      </button>
      <button
        className="overview-period-start"
        onClick={reset}
        title="Reset date period to preferred defaults"
      >
        <Icon path={mdiCalendarRefresh} className="icon small centering" />
      </button>
      <button
        className="overview-period-start"
        onClick={setToFuture}
        title="Set today as the period start"
      >
        <Icon path={mdiCalendarStart} className="icon small centering" />
      </button>
    </div>
  );
}

export { YearPicker, DatePeriodPicker, DatePeriodControls };
