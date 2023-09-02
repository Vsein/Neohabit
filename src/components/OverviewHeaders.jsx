import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '@mdi/react';
import {
  formatISO,
  startOfDay,
  differenceInDays,
  getDate,
  getYear,
  addDays,
  isToday,
  isWeekend,
  isLastDayOfMonth,
} from 'date-fns';
import { mdiCalendarText, mdiCalendarWeekend, mdiCog, mdiMenuLeft, mdiMenuRight } from '@mdi/js';
import { useChangeOverviewOrientationMutation } from '../state/services/settings';

function Month({ dateStart, index }) {
  const date = addDays(dateStart, index);
  const monthName = date.toLocaleString('en-US', { month: 'short' });
  if (getDate(date) === 1 || (index === 0 && !isLastDayOfMonth(date))) {
    return <div className="overview-months-month active">{monthName}</div>;
  }
  return <div className="overview-months-month">{monthName}</div>;
}

function OverviewMonths({ dateStart, dateEnd }) {
  const days = Array.from(new Array(differenceInDays(dateEnd, dateStart) + 1));
  return (
    <div className="overview-months">
      {days.map((_, index) => (
        <Month key={index} index={index} dateStart={dateStart} />
      ))}
    </div>
  );
}

function Day({ dateStart, index }) {
  const date = addDays(dateStart, index);
  return (
    <div
      className={`overview-days-day ${isToday(date) ? 'today' : ''} ${
        isWeekend(date) ? 'weekend' : ''
      }`}
    >
      {getDate(date)}
    </div>
  );
}

function OverviewDays({ dateStart, dateEnd }) {
  const days = Array.from(new Array(differenceInDays(dateEnd, dateStart) + 1));
  return (
    <div className="overview-days">
      {days.map((_, index) => (
        <Day key={index} index={index} dateStart={dateStart} />
      ))}
    </div>
  );
}

function OverviewSettings({ vertical }) {
  const [changeOverview] = useChangeOverviewOrientationMutation();

  return (
    <div className="overview-settings">
      <button
        className={`overview-open-settings ${vertical ? '' : 'active'}`}
        onClick={() => changeOverview(false)}
        title="Change to horizontal orientation"
      >
        <Icon path={mdiCalendarText} className="icon small centering" />
      </button>
      <button
        className={`overview-open-settings ${vertical ? 'active' : ''}`}
        onClick={() => changeOverview(true)}
        title="Change to vertical orientation"
      >
        <Icon path={mdiCalendarWeekend} className="icon small centering" />
      </button>
      <NavLink
        className="overview-open-settings"
        to="/settings#overview"
        title="Open overview settings"
      >
        <Icon path={mdiCog} className="icon small centering" />
      </NavLink>
    </div>
  );
}

function OverviewYear({ subYear, addYear, dateStart }) {
  return (
    <div className="overview-year-move">
      <button className="overview-period-move-left" onClick={subYear}>
        <Icon path={mdiMenuLeft} className="icon" />
      </button>
      <h3>{getYear(dateStart)}</h3>
      <button className="overview-period-move-right" onClick={addYear}>
        <Icon path={mdiMenuRight} className="icon" />
      </button>
    </div>
  );
}

function OverviewDates({ setDateStart, dateStart, setDateEnd, dateEnd }) {
  return (
    <div className="overview-dates">
      <input
        type="date"
        value={formatISO(dateStart, { representation: 'date' })}
        max="<?= date('Y-m-d'); ?>"
        rows="1"
        className="overview-dates-picker"
        onChange={(e) => setDateStart(startOfDay(new Date(e.target.value)))}
      />
      -
      <input
        type="date"
        value={formatISO(dateEnd, { representation: 'date' })}
        max="<?= date('Y-m-d'); ?>"
        rows="1"
        className="overview-dates-picker"
        onChange={(e) => setDateEnd(startOfDay(new Date(e.target.value)))}
      />
    </div>
  );
}

export { OverviewMonths, OverviewDays, OverviewSettings, OverviewYear, OverviewDates };
