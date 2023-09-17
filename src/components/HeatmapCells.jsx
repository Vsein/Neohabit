import React from 'react';
import { useDispatch } from 'react-redux';
import {
  differenceInHours,
  isSameWeek,
  differenceInCalendarWeeks,
  startOfWeek,
  endOfWeek,
  addMilliseconds,
  getTime,
} from 'date-fns';
import { hideTip, changeCellOffset, fixateCellTip } from './CellTip';
import { changeCellPeriodTo } from '../state/features/cellTip/cellTipSlice';
import { mixColors, hexToRgb } from '../hooks/usePaletteGenerator';

function Cell({ color, tipContent, value, length, vertical = true }) {
  const dispatch = useDispatch();
  const style = {
    backgroundColor: color,
    [vertical ? '--width' : '--height']: 1,
    [vertical ? '--height' : '--width']: length,
  };

  return (
    <div
      className="cell"
      style={style}
      onMouseEnter={(e) => changeCellOffset(e, tipContent, value)}
      onMouseLeave={hideTip}
      onClick={(e) => {
        dispatch(
          changeCellPeriodTo({
            ...tipContent,
            dateStart: getTime(tipContent.dateStart),
            dateEnd: getTime(tipContent.dateEnd),
          }),
        );
        fixateCellTip(e);
        changeCellOffset(e, tipContent, value, true);
      }}
    />
  );
}

function CellFractured({
  color,
  tipContent,
  value,
  targetValue,
  length,
  vertical = true,
  elimination,
}) {
  const dispatch = useDispatch();
  const style = {
    '--color': color,
    gap: '2px',
    [vertical ? '--width' : '--height']: 1,
    [vertical ? '--height' : '--width']: length,
  };

  const fractions = Math.max(value, targetValue);
  let dotted = false;
  let fractionHeight;
  let fractionWidth = 2;
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
    [index < value ? 'backgroundColor' : '']:
      index >= targetValue && elimination
        ? mixColors({ r: 0, g: 0, b: 0 }, hexToRgb(color), 0.4)
        : color,
  });

  return (
    <div
      className={`cell ${dotted ? 'dotted' : 'fractured'}`}
      style={style}
      onMouseEnter={(e) => changeCellOffset(e, tipContent, value)}
      onMouseLeave={hideTip}
      onClick={(e) => {
        dispatch(
          changeCellPeriodTo({
            ...tipContent,
            dateStart: getTime(tipContent.dateStart),
            dateEnd: getTime(tipContent.dateEnd),
          }),
        );
        fixateCellTip(e);
        changeCellOffset(e, tipContent, value, true);
      }}
    >
      {!dotted &&
        [...Array(+fractions)].map((point, index) => (
          <div key={point} className="cell-fraction" style={getStyle(index)} />
        ))}
    </div>
  );
}

function CellPeriod({
  heatmapID = '',
  dateStart,
  dateEnd,
  color,
  value,
  basePeriod = 24,
  vertical = true,
  targetValue = 1,
  targetStart = undefined,
  elimination,
  isOverview = false,
}) {
  const dispatch = useDispatch();
  const diffDays = differenceInHours(addMilliseconds(dateEnd, 1), dateStart) / basePeriod;
  const tipContent = {
    heatmapID,
    isPeriod: diffDays > 1,
    dateStart: targetStart || dateStart,
    dateEnd,
    actions: value,
  };
  if (isSameWeek(dateStart, dateEnd) || isOverview) {
    return (value <= 1 || value === undefined) && targetValue === 1 ? (
      <Cell
        color={color}
        tipContent={tipContent}
        value={value}
        length={diffDays}
        vertical={vertical}
      />
    ) : (
      <CellFractured
        color={color}
        tipContent={tipContent}
        value={value}
        targetValue={targetValue}
        length={diffDays}
        vertical={vertical}
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

  return (
    <>
      <div
        className={`cell-period ${width ? 'wide' : 'whole'}`}
        style={style}
        onMouseEnter={(e) => changeCellOffset(e, tipContent, value)}
        onMouseLeave={hideTip}
        onClick={(e) => {
          dispatch(
            changeCellPeriodTo({
              ...tipContent,
              dateStart: getTime(tipContent.dateStart),
              dateEnd: getTime(tipContent.dateEnd),
            }),
          );
          fixateCellTip(e);
          changeCellOffset(e, tipContent, value, true);
        }}
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

function CellPeriodDummy({ dateStart, dateEnd, color, basePeriod = 24 }) {
  const diffDays = differenceInHours(addMilliseconds(dateEnd, 1), dateStart) / basePeriod;
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

  return (
    <>
      <div className={`cell-period ${width ? 'wide' : 'whole'}`} style={style}>
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

export { Cell, CellPeriod, CellDummy, CellPeriodDummy };
