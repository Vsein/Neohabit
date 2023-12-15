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
      {numeric && (
        <CellNumericText
          small={vertical || length === 1}
          color={color}
          value={value}
          targetValue={targetValue}
        />
      )}
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
    columnGap: '2px',
    rowGap: '2px',
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
    style.columnGap = '1px';
    style.rowGap = '1px';
  } else if (fractions <= 12) {
    fractionHeight = 1 / 3;
    fractionWidth = 1 / 5;
    style.columnGap = '1px';
    style.rowGap = '1px';
  } else if (fractions <= 16) {
    fractionHeight = 1 / 5;
    fractionWidth = 1 / 5;
    style.columnGap = '1px';
    style.rowGap = '1px';
  } else {
    dotted = true;
  }

  fractionWidth *= length;
  fractionWidth += (length - 1) * (2 / 15);

  const getStyle = (index) => ({
    [vertical && length > 1 ? '--width' : '--height']: fractionHeight,
    [vertical && length > 1 ? '--height' : '--width']: fractionWidth,
    [vertical && length > 1 && fractions <= 2 ? 'height' : '']: '100%',
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
          <div key={index} className="cell-fraction" style={getStyle(index)} />
        ))}
    </div>
  );
}

function CellPeriod({
  heatmapID = '',
  dateStart,
  dateEnd,
  color = 'transparent',
  dummy = false,
  value = 0,
  basePeriod = 24,
  vertical = true,
  targetValue = 1,
  targetStart = undefined,
  targetEnd = undefined,
  elimination = false,
  numeric = false,
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
    (value > 1 || numeric) && !dummy && elimination && value > targetValue
      ? mixColors({ r: 0, g: 0, b: 0 }, hexToRgb(color), 0.4)
      : color;

  let width = differenceInCalendarWeeks(dateEnd, dateStart) - 1;
  width += dateStart.getTime() === startOfWeek(dateStart).getTime();
  width += dateEnd.getTime() === endOfWeek(dateEnd).getTime();
  const style = {
    [value ? '--blank-cell-color' : '']: trueColor,
    '--height': 7,
    '--width': width,
  };
  if (dummy) {
    Object.assign(style, {
      '--blank-cell-color': 'transparent',
      '--cell-border-color': 'transparent',
      '--cell-shadow-color': 'transparent',
      pointerEvents: 'none',
    });
  }
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
    visibility: afterHeight !== 0 ? 'visible' : 'hidden',
  };

  return (
    <>
      <div
        className={`cell-period centering ${width ? 'wide' : 'hollow'} ${
          value >= 100 || (value === 0 && targetValue >= 100) ? 'hundred' : ''
        } `}
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
        {(value > 1 || numeric) && !!width && (
          <CellNumericText color={color} value={value} targetValue={targetValue} />
        )}
        <div className="cell-period-before centering" style={styleBefore}>
          {!width && diffDays <= 7 && (value > 1 || numeric) && (
            <CellNumericText small={true} color={color} value={value} targetValue={targetValue} />
          )}
        </div>
        <div className="cell-period-after centering" style={styleAfter}>
          {!width && diffDays <= 7 && (value > 1 || numeric) && (
            <CellNumericText small={true} color={color} value={value} targetValue={targetValue} />
          )}
        </div>
        {diffDays > 7 && !width && (
          <div
            className="cell-period-connector centering"
            style={{
              '--height': afterHeight - (7 - beforeHeight),
              '--offset-top': 7 - beforeHeight,
            }}
          >
            {!width && (value > 1 || numeric) && (
              <CellNumericText color={color} value={value} targetValue={targetValue} />
            )}
          </div>
        )}
      </div>
      {afterHeight ? <CellDummy length={afterHeight} /> : <> </>}
    </>
  );
}

function CellNumericText({ small = false, value, targetValue }) {
  const getHundredStyle = (displayedValue) => {
    if (!small || displayedValue < 100) return {};
    const stringValue = displayedValue.toString();
    const without1 = stringValue.indexOf('1') === -1;
    const single1 = !without1 && stringValue.indexOf('1') === stringValue.lastIndexOf('1');
    return {
      paddingBlock: '4px',
      fontSize: '10px',
      [without1 ? 'marginLeft' : '']: '-1.75px',
      [without1 ? 'letterSpacing' : '']: '-0.75px',
      [single1 ? 'marginLeft' : '']: '-1px',
    };
  };

  if (value) {
    return (
      <p className="cell-numeric" style={getHundredStyle(value)}>
        {value}
      </p>
    );
  }
  return targetValue > 1 ? (
    <p className="cell-numeric target" style={getHundredStyle(targetValue)}>
      {targetValue}
    </p>
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
export { Cell, CellPeriod, CellDummy };
