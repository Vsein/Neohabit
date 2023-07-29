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
import { formatTipContent, hideTip, changeCellOffset } from './CellTip';

function Cell({ color, date, value, length, vertical = true }) {
  const style = {
    backgroundColor: color,
    [vertical ? '--width' : '--height']: 1,
    [vertical ? '--height' : '--width']: length,
  };
  const content = formatTipContent({
    actions: value,
    period: false,
    dateStart: date,
  });

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
  const content = formatTipContent({
    actions: value,
    period: false,
    dateStart: date,
  });

  let dotted = false;
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
      className={`cell ${dotted ? 'dotted' : 'fractured'}`}
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
    return value <= 1 || value == undefined || vertical ? (
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
  const content = formatTipContent({
    actions: value,
    period: false,
    dateStart,
    dateEnd,
  });

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

export { Cell, CellPeriod, CellDummy };
