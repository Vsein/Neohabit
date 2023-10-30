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
import { mixColors, hexToRgb, getNumericTextColor } from '../hooks/usePaletteGenerator';

function Cell({
  color,
  tipContent,
  value,
  length,
  vertical = true,
  numeric,
  targetValue = 1,
  elimination,
}) {
  const trueColor =
    numeric && elimination && value > targetValue
      ? mixColors({ r: 0, g: 0, b: 0 }, hexToRgb(color), 0.4)
      : color;
  const dispatch = useDispatch();
  const style = {
    [value ? '--blank-cell-color' : '']: trueColor,
    [vertical ? '--width' : '--height']: 1,
    [vertical ? '--height' : '--width']: length,
  };

  return (
    <div
      className={`cell centering ${
        value >= 100 || (value === 0 && targetValue >= 100) ? 'hundred' : ''
      }`}
      style={style}
      onMouseEnter={(e) => changeCellOffset(e, tipContent, value)}
      onMouseLeave={hideTip}
      onClick={(e) => {
        dispatch(changeCellPeriodTo({ ...tipContent }));
        fixateCellTip(e);
        changeCellOffset(e, tipContent, value, true);
      }}
    >
      <CellNumericText
        small={vertical || length === 1}
        numeric={numeric}
        color={color}
        value={value}
        targetValue={targetValue}
      />
    </div>
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
    [value ? 'boxShadow' : '']: 'none',
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
    [fractions <= 2 && vertical ? 'height' : '']: '100%',
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
        dispatch(changeCellPeriodTo({ ...tipContent }));
        fixateCellTip(e);
        changeCellOffset(e, tipContent, value, true);
      }}
    >
      {!dotted &&
        [...Array(+fractions)].map((point, index) => (
          <div key={index} className="cell-fraction" style={getStyle(index)} />
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
  targetEnd = undefined,
  elimination,
  numeric,
  isOverview = false,
}) {
  const dispatch = useDispatch();
  const diffDays = differenceInHours(addMilliseconds(dateEnd, 1), dateStart) / basePeriod;
  if (diffDays < 1) {
    return <></>;
  }
  const tipContent = {
    heatmapID,
    isPeriod: diffDays > 1 || differenceInHours(targetEnd, targetStart) > 24,
    dateStart: targetStart || dateStart,
    dateEnd: targetEnd || dateEnd,
    actions: value,
  };
  if (isSameWeek(dateStart, dateEnd) || isOverview) {
    return ((value <= 1 || value === undefined) && targetValue === 1) || numeric ? (
      <Cell
        color={color}
        tipContent={tipContent}
        value={value}
        length={diffDays}
        vertical={vertical}
        numeric={numeric}
        targetValue={targetValue}
        elimination={elimination}
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

  const trueColor =
    (value > 1 || numeric) && elimination && value > targetValue
      ? mixColors({ r: 0, g: 0, b: 0 }, hexToRgb(color), 0.4)
      : color;

  let width = differenceInCalendarWeeks(dateEnd, dateStart) - 1;
  width += dateStart.getTime() === startOfWeek(dateStart).getTime();
  width += dateEnd.getTime() === endOfWeek(dateEnd).getTime();
  const style = {
    [value ? 'backgroundColor' : '']: trueColor,
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
        className={`cell-period centering ${width ? 'wide' : 'whole'}`}
        style={style}
        onMouseEnter={(e) => changeCellOffset(e, tipContent, value)}
        onMouseLeave={hideTip}
        onClick={(e) => {
          dispatch(changeCellPeriodTo({ ...tipContent }));
          fixateCellTip(e);
          changeCellOffset(e, tipContent, value, true);
        }}
      >
        <CellNumericText
          numeric={(value > 1 || numeric) && width}
          color={color}
          value={value}
          targetValue={targetValue}
        />
        <div className="cell-period-before centering" style={styleBefore}>
          <CellNumericText
            small={true}
            numeric={!width && diffDays <= 7 && (value > 1 || numeric)}
            color={color}
            value={value}
            targetValue={targetValue}
          />
        </div>
        <div className="cell-period-after centering" style={styleAfter}>
          <CellNumericText
            small={true}
            numeric={!width && diffDays <= 7 && (value > 1 || numeric)}
            color={color}
            value={value}
            targetValue={targetValue}
          />
        </div>
        {diffDays > 7 && !width && (
          <div
            className="cell-period-connector centering"
            style={{
              '--height': afterHeight - (7 - beforeHeight),
              '--offset-top': 7 - beforeHeight,
            }}
          >
            <CellNumericText
              numeric={!width && (value > 1 || numeric)}
              color={color}
              value={value}
              targetValue={targetValue}
            />
          </div>
        )}
      </div>
      {afterHeight ? <CellDummy length={afterHeight} /> : <> </>}
    </>
  );
}

function CellNumericText({ small = false, numeric, color, value, targetValue }) {
  const getHundredStyle = (displayedValue) =>
    small &&
    displayedValue >= 100 && {
      paddingBlock: '4px',
      fontSize: '10px',
      ...((displayedValue + '').indexOf('1') === -1
        ? {
            marginLeft: '-1.75px',
            letterSpacing: '-0.75px',
          }
        : (displayedValue + '').indexOf('1') === (displayedValue + '').lastIndexOf('1') && {
            marginLeft: '-1px',
          }),
    };
  return numeric ? (
    <>
      {value ? (
        <p
          className="cell-numeric"
          style={{
            color: getNumericTextColor(color),
            ...getHundredStyle(value),
          }}
        >
          {value}
        </p>
      ) : (
        <></>
      )}
      {targetValue > 1 && !value ? (
        <p
          className="cell-numeric target"
          style={{
            ...getHundredStyle(targetValue),
          }}
        >
          {targetValue}
        </p>
      ) : (
        <></>
      )}
    </>
  ) : (
    <></>
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
  let width = differenceInCalendarWeeks(dateEnd, dateStart);
  width -= dateStart.getTime() === startOfWeek(dateStart).getTime();
  width += dateEnd.getTime() === endOfWeek(dateEnd).getTime();
  const style = {
    backgroundColor: 'transparent',
    '--cell-border-color': 'transparent',
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
