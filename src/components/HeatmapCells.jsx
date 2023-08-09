import React from 'react';
import {
  differenceInHours,
  differenceInDays,
  isSameWeek,
  differenceInCalendarWeeks,
  startOfWeek,
  endOfWeek,
  addMilliseconds,
  startOfDay,
} from 'date-fns';
import { formatTipContent, hideTip, changeCellOffset } from './CellTip';

function Cell({ color, dateStart, dateEnd, value, length, vertical = true }) {
  const style = {
    backgroundColor: color,
    [vertical ? '--width' : '--height']: 1,
    [vertical ? '--height' : '--width']: length,
  };
  const content = formatTipContent({
    actions: value,
    period: !!differenceInDays(dateEnd, dateStart),
    dateStart,
    dateEnd,
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

function CellFractured({
  color,
  blankColor,
  date,
  value,
  targetValue,
  length,
  vertical = true,
}) {
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

  const fractions = Math.max(value, targetValue);
  let dotted = false;
  let fractionHeight = 15;
  let fractionWidth = 15;
  if (fractions <= 2) {
    fractionHeight = 1 / 2;
  } else if (fractions <= 4) {
    fractionHeight = 1 / 2;
    fractionWidth = 1 / 2;
  } else if (fractions <= 6) {
    fractionHeight = 1 / 2;
    fractionWidth = 1 / 3;
    style.columnGap = '1px';
  } else if (fractions <= 9) {
    fractionHeight = 1 / 3;
    fractionWidth = 1 / 3;
    style.gap = '1px';
  } else if (fractions <= 12) {
    fractionHeight = 1 / 3;
    fractionWidth = 1 / 5;
    style.gap = '1px';
  } else if (fractions <= 16) {
    fractionHeight = 1 / 5;
    fractionWidth = 1 / 5;
    style.gap = '1px';
  } else {
    dotted = true;
  }

  fractionWidth *= length;
  fractionWidth += (length - 1) * (2 / 15);

  const styleFraction = {
    backgroundColor: color,
    '--height': fractionHeight,
    '--width': fractionWidth,
    margin: 0,
  };
  const styleFractionBlank = {
    ...styleFraction,
    backgroundColor: blankColor,
  };
  return (
    <div
      className={`cell ${dotted ? 'dotted' : 'fractured'}`}
      style={style}
      onMouseEnter={(e) => changeCellOffset(e, content)}
      onMouseLeave={hideTip}
    >
      {!dotted &&
        [...Array(+fractions)].map((point, index) => (
          <div
            key={point}
            className="cell-fraction"
            style={index >= value ? styleFractionBlank : styleFraction}
          />
        ))}
    </div>
  );
}

function CellPeriod({
  dateStart,
  dateEnd,
  color,
  blankColor,
  value,
  basePeriod = 24,
  vertical = true,
  targetValue = 1,
}) {
  const diffDays =
    differenceInHours(addMilliseconds(dateEnd, 1), dateStart) / basePeriod;
  if (isSameWeek(dateStart, dateEnd) || !vertical) {
    return (value <= 1 || value == undefined || vertical) &&
      targetValue === 1 ? (
      <Cell
        color={color}
        value={value}
        dateStart={dateStart}
        dateEnd={dateEnd}
        length={diffDays}
        vertical={vertical}
      />
    ) : (
      <CellFractured
        color={color}
        blankColor={blankColor}
        value={value}
        date={dateStart}
        length={diffDays}
        vertical={vertical}
        targetValue={targetValue}
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
