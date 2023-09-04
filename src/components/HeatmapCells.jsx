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
  min,
} from 'date-fns';
import { formatTipContent, hideTip, changeCellOffset } from './CellTip';

function Cell({ color, dateStart, dateEnd, value, length, targetStart, vertical = true }) {
  const style = {
    backgroundColor: color,
    [vertical ? '--width' : '--height']: 1,
    [vertical ? '--height' : '--width']: length,
  };
  const content = formatTipContent({
    actions: value,
    period: !!differenceInDays(dateEnd, dateStart),
    dateStart: targetStart || dateStart,
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
  dateStart,
  dateEnd,
  value,
  targetValue,
  targetStart,
  length,
  vertical = true,
  elimination,
}) {
  const style = {
    '--color': color,
    gap: '2px',
    [vertical ? '--width' : '--height']: 1,
    [vertical ? '--height' : '--width']: length,
  };
  const content = formatTipContent({
    actions: value,
    period: !!length,
    dateStart: targetStart || dateStart,
    dateEnd,
  });

  const fractions = Math.max(value, targetValue);
  let dotted = false;
  let fractionHeight;
  let fractionWidth;
  if (fractions <= 2) {
    fractionHeight = 1 / 2;
  } else if (fractions <= 4) {
    fractionHeight = 1 / 2;
    fractionWidth = length > 1 ? 1 / 1.9 : 1 / 2;
    style.columnGap = length > 1 ? '1px' : '1px';
  } else if (fractions <= 6) {
    fractionHeight = 1 / 2;
    fractionWidth = length > 1 ? 1 / 3.2 : 1 / 3;
    style.columnGap = length > 1 ? '2px' : '1px';
  } else if (fractions <= 9) {
    fractionHeight = 1 / 3;
    fractionWidth = length > 1 ? 1 / 3.2 : 1 / 3;
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

  const getStyle = (index) => ({
    [vertical ? '--width' : '--height']: fractionHeight,
    [vertical ? '--height' : '--width']: fractionWidth,
    margin: 0,
    [index < value ? 'backgroundColor' : '']: index >= targetValue && elimination ? 'black' : color,
  });

  return (
    <div
      className={`cell ${dotted ? 'dotted' : 'fractured'}`}
      style={style}
      onMouseEnter={(e) => changeCellOffset(e, content)}
      onMouseLeave={hideTip}
    >
      {!dotted &&
        [...Array(+fractions)].map((point, index) => (
          <div key={point} className="cell-fraction" style={getStyle(index)} />
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
  targetStart = undefined,
  elimination,
  isOverview = false,
}) {
  const diffDays = differenceInHours(addMilliseconds(dateEnd, 1), dateStart) / basePeriod;
  if (isSameWeek(dateStart, dateEnd) || !vertical || isOverview) {
    return (value <= 1 || value == undefined || !isOverview) && targetValue === 1 ? (
      <Cell
        color={color}
        value={value}
        dateStart={dateStart}
        targetStart={targetStart}
        dateEnd={dateEnd}
        length={diffDays}
        vertical={vertical}
      />
    ) : (
      <CellFractured
        color={color}
        blankColor={blankColor}
        value={value}
        dateStart={dateStart}
        dateEnd={dateEnd}
        length={diffDays}
        vertical={vertical}
        targetValue={targetValue}
        targetStart={targetStart}
        elimination={elimination}
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
    differenceInHours(addMilliseconds(endOfWeek(dateStart), 1), dateStart) / basePeriod;
  const styleBefore = {
    '--height': beforeHeight,
    '--width': 1,
    visibility: beforeHeight !== 7 ? 'visible' : 'hidden',
  };
  const afterHeight =
    differenceInHours(addMilliseconds(dateEnd, 1), startOfWeek(addMilliseconds(dateEnd, 1))) /
    basePeriod;
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
