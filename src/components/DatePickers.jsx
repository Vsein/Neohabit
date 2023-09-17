import React from 'react';
import Icon from '@mdi/react';
import { formatISO, startOfDay, getYear } from 'date-fns';
import { mdiMenuLeft, mdiMenuRight } from '@mdi/js';

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

function DatePeriodPicker({ setDateStart, dateStart, setDateEnd, dateEnd }) {
  return (
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
  );
}

export { YearPicker, DatePeriodPicker };
