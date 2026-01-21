import React, { useRef } from 'react';
import { Icon } from '@mdi/react';
import { getYear } from 'date-fns';
import DatePicker from 'react-datepicker';
import {
  mdiMenuUp,
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
  mobile = false,
  isPastPeriod,
  isFuturePeriod,
}) {
  const startRef = useRef();
  const endRef = useRef();

  const close = () => {
    startRef.current.setOpen(false);
    endRef.current.setOpen(false);
  };

  return (
    <div className="dates-container">
      <PreviousPeriodButton onClick={subPeriod} isFuturePeriod={isFuturePeriod} />
      <div className="dates-period">
        <DatePicker
          ref={startRef}
          showIcon
          wrapperClassName="dates-period-picker"
          popperClassName="popper"
          selectsStart
          selected={dateStart}
          startDate={dateStart}
          endDate={dateEnd}
          onChange={(date) => setDateStart(date)}
          onFocus={(e) => {
            e.target.readOnly = true;
          }}
          enableTabLoop={false}
          withPortal={mobile}
          icon={
            <Icon
              path={mdiCalendarBlank}
              className="icon centering"
              style={{ width: '18px', height: '18px' }}
            />
          }
        >
          <DatePeriodControls
            setToPast={setToPast}
            reset={reset}
            setToFuture={setToFuture}
            onClick={close}
          />
        </DatePicker>
        <span style={{ marginLeft: '0px', marginRight: '10px' }}>-</span>
        <DatePicker
          ref={endRef}
          showIcon
          wrapperClassName="dates-period-picker"
          popperClassName="popper"
          selectsEnd
          selected={dateEnd}
          startDate={dateStart}
          endDate={dateEnd}
          onChange={(date) => setDateEnd(date)}
          onFocus={(e) => {
            e.target.readOnly = true;
          }}
          enableTabLoop={false}
          withPortal={mobile}
          icon={
            <Icon
              path={mdiCalendarBlank}
              className="icon centering"
              style={{ width: '18px', height: '18px' }}
            />
          }
        >
          <DatePeriodControls
            setToPast={setToPast}
            reset={reset}
            setToFuture={setToFuture}
            onClick={close}
          />
        </DatePicker>
      </div>
      <NextPeriodButton onClick={addPeriod} alignLeft isPastPeriod={isPastPeriod} />
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
      {isHeatmap && !vertical && <NextPeriodButton onClick={addMonth} />}
    </div>
  );
}

function DatePeriodControls({ setToPast, reset, setToFuture, onClick }) {
  return (
    <div className="dates-period-footer" onClick={onClick}>
      <button
        className="overview-period-button"
        onClick={setToPast}
        title="Set today as the last day"
        type="button"
      >
        <Icon path={mdiCalendarEnd} className="icon small centering" />
      </button>
      <button
        className="overview-period-button"
        onClick={reset}
        title="Reset date period [r]"
        type="button"
      >
        <Icon path={mdiCalendarRefresh} className="icon small centering" />
      </button>
      <button
        className="overview-period-button"
        onClick={setToFuture}
        title="Set today as the first day"
        type="button"
      >
        <Icon path={mdiCalendarStart} className="icon small centering" />
      </button>
    </div>
  );
}

function NextPeriodButton({ onClick, alignLeft, style, isPastPeriod }) {
  return (
    <button
      type="button"
      className={`centering overview-date-button ${alignLeft ? 'left' : ''} ${isPastPeriod ? 'highlight' : ''}`}
      onClick={onClick}
      title="Next period [L]"
      style={style}
    >
      <Icon path={mdiMenuRight} className="icon" />
    </button>
  );
}

function PreviousPeriodButton({ onClick, alignRight, vertical, style, isFuturePeriod }) {
  return (
    <button
      type="button"
      className={`centering overview-date-button ${alignRight ? 'right' : ''} ${isFuturePeriod ? 'highlight' : ''}`}
      onClick={onClick}
      title="Previous period [H]"
      style={style}
    >
      <Icon path={vertical ? mdiMenuUp : mdiMenuLeft} className="icon" />
    </button>
  );
}

export {
  YearPicker,
  DatePeriodPicker,
  DatePeriodControls,
  OverviewTopbarRight,
  NextPeriodButton,
  PreviousPeriodButton,
};
