import React from 'react';
import { Icon } from '@mdi/react';
import { formatISO, startOfDay, getYear } from 'date-fns';
import DatePicker from 'react-datepicker';
import {
  mdiMenuLeft,
  mdiMenuRight,
  mdiCalendarBlank,
  mdiCalendarEnd,
  mdiCalendarStart,
  mdiCalendarRefresh,
} from '@mdi/js';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/_datepicker.scss';

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

function DatePeriodPicker({
  setDateStart,
  dateStart,
  setDateEnd,
  dateEnd,
  addPeriod,
  subPeriod,
  setToPast,
  reset,
  setToFuture,
}) {
  return (
    <div className="dates-container">
      <button className="centering" onClick={subPeriod} title="Move period to the left [h]">
        <Icon path={mdiMenuLeft} className="icon" />
      </button>
      <div className="dates-period">
        <DatePicker
          showIcon
          wrapperClassName="dates-period-picker"
          popperClassName="popper"
          selectsStart
          selected={dateStart}
          startDate={dateStart}
          endDate={dateEnd}
          onChange={(date) => setDateStart(date)}
          enableTabLoop={false}
          icon={
            <Icon
              path={mdiCalendarBlank}
              className="icon centering"
              style={{ width: '18px', height: '18px' }}
            />
          }
        >
          <DatePeriodControls setToPast={setToPast} reset={reset} setToFuture={setToFuture} />
        </DatePicker>
        <span style={{marginLeft: '0px', marginRight: '10px' }}>-</span>
        <DatePicker
          showIcon
          wrapperClassName="dates-period-picker"
          popperClassName="popper"
          selectsEnd
          selected={dateEnd}
          startDate={dateStart}
          endDate={dateEnd}
          onChange={(date) => setDateEnd(date)}
          enableTabLoop={false}
          icon={
            <Icon
              path={mdiCalendarBlank}
              className="icon centering"
              style={{ width: '18px', height: '18px' }}
            />
          }
        >
          <DatePeriodControls setToPast={setToPast} reset={reset} setToFuture={setToFuture} />
        </DatePicker>
      </div>
      <button className="centering left" onClick={addPeriod} title="Move period to the right [l]">
        <Icon path={mdiMenuRight} className="icon" />
      </button>
    </div>
  );
}

function OverviewTopbarRight({
  isHeatmap = true,
  vertical,
  dateStart,
  subYear,
  addYear,
  addMonth,
}) {
  return (
    <div className="overview-topbar-right">
      {isHeatmap && vertical && (
        <YearPicker subYear={subYear} addYear={addYear} dateStart={dateStart} />
      )}
      {isHeatmap && !vertical && (
        <button className="centering" onClick={addMonth} title="Move month to the right [L]">
          <Icon path={mdiMenuRight} className="icon" />
        </button>
      )}
    </div>
  );
}

function DatePeriodControls({ setToPast, reset, setToFuture }) {
  return (
    <div className="dates-period-footer">
      <button
        className="overview-period-button"
        onClick={setToPast}
        title="Set today as the period end"
      >
        <Icon path={mdiCalendarEnd} className="icon small centering" />
      </button>
      <button
        className="overview-period-button"
        onClick={reset}
        title="Reset date period to preferred defaults [r]"
      >
        <Icon path={mdiCalendarRefresh} className="icon small centering" />
      </button>
      <button
        className="overview-period-button"
        onClick={setToFuture}
        title="Set today as the period start"
      >
        <Icon path={mdiCalendarStart} className="icon small centering" />
      </button>
    </div>
  );
}

export { YearPicker, DatePeriodPicker, DatePeriodControls, OverviewTopbarRight };
