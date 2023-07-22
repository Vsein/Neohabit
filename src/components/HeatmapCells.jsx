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
  const parent =
    document.querySelector('.habit') ||
    document.querySelector('.overview-container');
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
    offset = (tipWidth / 4) * 3;
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
  cellTip.style.top = '0px';
}

function Cell({ color, date, value, length, vertical = true }) {
  const style = {
    backgroundColor: color,
    [vertical ? '--width' : '--height']: 1,
    [vertical ? '--height' : '--width']: length,
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

function CellFractured({ color, date, value, length, vertical = true }) {
  const style = {
    '--color': color,
    gap: '2px',
    [vertical ? '--width' : '--height']: 1,
    [vertical ? '--height' : '--width']: length,
  };
  let dotted = false;

  const formattedDate = formatDate(date);
  let content;
  if (!value) {
    content = `No activity on ${formattedDate}`;
  } else if (value === 1) {
    content = `1 action on ${formattedDate}`;
  } else {
    content = `${value} actions on ${formattedDate}`;
  }

  let fractionHeight = 15;
  let fractionWidth = 15;
  if (value <= 2) {
    fractionHeight = 1 / 2;
  } else if (value <= 4) {
    fractionHeight = 1 / 2;
    fractionWidth = 1 / 2;
  } else if (value <= 6) {
    fractionHeight = 1 / 2;
    fractionWidth = 1 / 3;
    style.columnGap = '1px';
  } else if (value <= 9) {
    fractionHeight = 1 / 3;
    fractionWidth = 1 / 3;
    style.gap = '1px';
  } else if (value <= 12) {
    fractionHeight = 1 / 3;
    fractionWidth = 1 / 5;
    style.gap = '1px';
  } else if (value <= 16) {
    fractionHeight = 1 / 5;
    fractionWidth = 1 / 5;
    style.gap = '1px';
  } else {
    dotted = true;
  }
  const styleFraction = {
    backgroundColor: color,
    '--height': fractionHeight,
    '--width': fractionWidth,
    margin: 0,
  };
  return (
    <div
      className={`cell ${dotted ? '' : 'fractured'}`}
      style={style}
      onMouseEnter={(e) => changeCellOffset(e, content)}
      onMouseLeave={hideTip}
    >
      {!dotted &&
        [...Array(+value)].map((point) => (
          <div key={point} className="cell-fraction" style={styleFraction} />
        ))}
    </div>
  );
}

function CellPeriod({
  dateStart,
  dateEnd,
  color,
  value,
  basePeriod = 24,
  vertical = true,
}) {
  const diffDays =
    differenceInHours(addMilliseconds(dateEnd, 1), dateStart) / basePeriod;

  if (isSameWeek(dateStart, dateEnd) || !vertical) {
    return value <= 1 || value == undefined || value > 9 ? (
      <Cell
        color={color}
        value={value}
        date={dateStart}
        length={diffDays}
        vertical={vertical}
      />
    ) : (
      <CellFractured
        color={color}
        value={value}
        date={dateStart}
        length={diffDays}
        vertical={vertical}
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
        className={`cell-period ${width ? 'wide' : 'whole'}`}
        style={style}
        onMouseEnter={(e) => changeCellOffset(e, content)}
        onMouseLeave={hideTip}
      >
        <div className="cell-period-before" style={styleBefore} />
        <div className="cell-period-after" style={styleAfter} />
        {diffDays > 7 && !width && (
          <div
            className="cell-period-connector"
            style={{
              '--height': afterHeight - (7 - beforeHeight),
              '--offset-top': 7 - beforeHeight,
            }}
          />
        )}
      </div>
      {afterHeight ? <CellDummy length={afterHeight} /> : <> </>}
    </>
  );
}

function CellDummy({ length, vertical = true }) {
  const style = {
    [vertical ? '--width' : '--height']: 1,
    [vertical ? '--height' : '--width']: length,
  };
  return <div style={style} className="dummy" />;
}

export { Cell, CellPeriod, CellDummy, hideTip };
