import React from 'react';
import {
  differenceInHours,
  isSameWeek,
  differenceInCalendarWeeks,
  startOfWeek,
  endOfWeek,
  addMilliseconds,
  startOfDay,
} from 'date-fns';

function formatDate(date) {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    // The below are needed only for dev stage, I'm thinking of hiding
    // the time and whatnot if the period starts exactly at 0:00.
    // And it's also kinda sucky to use US locale. With all those AMs
    // ans PMs it gets pretty ambiguous quickly.
    weekday: 'short',
  });
}

async function changeCellOffset(e, content) {
  const cell = e.target;
  const parent = document.querySelector('.habit') || document.querySelector('.overview-container');
  const rect = cell.getBoundingClientRect();
  const rectParent = parent.getBoundingClientRect();
  const cellTip = document.querySelector('.cell-tip');
  cellTip.textContent = content;
  const tipWidth = cellTip.getBoundingClientRect().width;
  let offset = tipWidth / 2 + 15;
  if (rect.x - 50 < rectParent.x || rect.x - 50 < 36) {
    offset = tipWidth / 4;
  } else if (rect.x - 100 < rectParent.x || rect.x - 100 < 36) {
    offset = tipWidth / 2;
  } else if (rect.x + 50 > rectParent.x + rectParent.width) {
    offset = tipWidth;
  } else if (rect.x + 100 > rectParent.x + rectParent.width) {
    offset = tipWidth / 4 * 3;
  }
  cellTip.classList.remove('hidden');
  cellTip.style.top = `${window.pageYOffset + rect.y - 40}px`;
  cellTip.style.left = `${rect.x + rect.width / 2 - offset + 15}px`;
  cellTip.style.pointerEvents = 'none';
}

function hideTip() {
  const cellTip = document.querySelector('.cell-tip');
  cellTip.classList.add('hidden');
  cellTip.style.pointerEvents = 'auto';
}


function Cell({ color, date, value, height = 1, width = 1 }) {
  const style = {
    backgroundColor: color,
    '--height': height,
  };

  const formattedDate = formatDate(date);
  let content;
  if (!value) {
    content = `No activity on ${formattedDate}`;
  } else if (value === 1) {
    content = `1 action on ${formattedDate}`;
  } else {
    content = `${value} actions on ${formattedDate}`;
  }

  return (
    <div
      className="cell"
      style={style}
      onMouseEnter={(e) => changeCellOffset(e, content)}
      onMouseLeave={hideTip}
    />
  );
}

function CellPeriod({
  dateStart,
  dateEnd,
  color,
  value,
  basePeriod = 24,
  opacity = 1,
}) {
  const diffDays =
    differenceInHours(addMilliseconds(dateEnd, 1), dateStart) / basePeriod;

  if (isSameWeek(dateStart, dateEnd)) {
    return (
      <Cell
        color={color}
        value={value}
        date={dateStart}
        height={diffDays}
        opacity={opacity}
      />
    );
  }
  let width = differenceInCalendarWeeks(dateEnd, dateStart) - 1;
  width += dateStart.getTime() === startOfWeek(dateStart).getTime();
  width += dateEnd.getTime() === endOfWeek(dateEnd).getTime();
  const style = {
    backgroundColor: color,
    '--height': 7,
    '--width': width,
  };
  const beforeHeight =
    differenceInHours(addMilliseconds(endOfWeek(dateStart), 1), dateStart) /
    basePeriod;
  const styleBefore = {
    '--height': beforeHeight,
    '--width': 1,
    visibility: beforeHeight !== 7 ? 'visible' : 'hidden',
  };
  const afterHeight =
    differenceInHours(
      addMilliseconds(dateEnd, 1),
      startOfWeek(addMilliseconds(dateEnd, 1)),
    ) / basePeriod;
  const styleAfter = {
    '--height': afterHeight,
    '--width': 1,
  };
  if (afterHeight === 0) styleAfter.visibility = 'hidden';
  const formattedDateStart = formatDate(dateStart);
  const formattedDateEnd = formatDate(dateEnd);

  let content;
  if (!value) {
    content = `No activity on ${formattedDateStart} - ${formattedDateEnd}`;
  } else if (value === 1) {
    content = `1 action on ${formattedDateStart} - ${formattedDateEnd}`;
  } else {
    content = `${value} actions on ${formattedDateStart} - ${formattedDateEnd}`;
  }

  return (
    <>
      <div
        className={`cell-period ${
          diffDays <= 7 ? 'whole' : 'wide'
        }`}
        style={style}
        onMouseEnter={(e) => changeCellOffset(e, content)}
        onMouseLeave={hideTip}
      >
        <div className="cell-period-before" style={styleBefore} />
        <div className="cell-period-after" style={styleAfter} />
      </div>
      {afterHeight ? <TallDummy height={afterHeight} /> : <> </>}
    </>
  );
}

function TallDummy({ height, vertical = false }) {
  const style = {
    [vertical ? '--width' : '--height']: height,
    [vertical ? '--height' : '--width']: 1,
  };
  return <div style={style} className="dummy" />;
}

export { Cell, CellPeriod, TallDummy, hideTip };
