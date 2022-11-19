import React from 'react';
import {
  differenceInHours,
  isSameWeek,
  differenceInCalendarWeeks,
  startOfWeek,
  endOfWeek,
  addMilliseconds,
} from 'date-fns';

function formatDate(date) {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function Cell({ color, date, value, height = 1, width = 1, opacity = 1 }) {
  const style = {
    backgroundColor: color,
    // opacity: opacity,
    '--height': height,
  };

  function changeCellOffset(e) {
    const cell = e.target;
    const parent = e.target.parentElement;
    const rect = cell.getBoundingClientRect();
    const rectParent = parent.getBoundingClientRect();
    if (rect.x - 50 < rectParent.x || rect.x - 50 < 36) {
      cell.classList.add('offset--2');
    } else if (rect.x - 100 < rectParent.x || rect.x - 100 < 36) {
      cell.classList.add('offset--1');
    } else if (rect.x + 50 > rectParent.x + rectParent.width) {
      cell.classList.add('offset-2');
    } else if (rect.x + 100 > rectParent.x + rectParent.width) {
      cell.classList.add('offset-1');
    }
  }

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
      className="timeline-cells-cell"
      style={style}
      data-attr={content}
      onMouseEnter={changeCellOffset}
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
    // opacity: opacity,
    // width: (width === 1 ? 16 : 11 * width + 2 * 2 * (width - 1)),
  };
  const beforeHeight =
    differenceInHours(addMilliseconds(endOfWeek(dateStart), 1), dateStart) /
    basePeriod;
  const styleBefore = {
    '--height': beforeHeight,
    '--width': 1,
    visibility: dateStart.getDay() ? 'visible' : 'hidden',
  };
  const afterHeight =
    differenceInHours(addMilliseconds(dateEnd, 1), startOfWeek(dateEnd)) /
    basePeriod;
  const styleAfter = {
    '--height': afterHeight,
    '--width': 1,
  };
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
        className={`timeline-cells-cell-period ${diffDays <= 7 ? 'whole' : ''}`}
        style={style}
        data-attr={content}
        // onMouseEnter={changeCellOffset}
      >
        <div
          className="timeline-cells-cell-period-before"
          style={styleBefore}
        />
        <div className="timeline-cells-cell-period-after" style={styleAfter} />
      </div>
      <TallDummy height={afterHeight} />
    </>
  );
}

function TallDummy({ height }) {
  const style = {
    '--height': height,
  };
  return <div style={style} className="dummy" />;
}

function CellWeek({ dateStart, dateEnd }) {
  return <Cell value={value} date={dateStart} color={color} heigth={14} />;
}

export { Cell, CellWeek, CellPeriod, TallDummy };
