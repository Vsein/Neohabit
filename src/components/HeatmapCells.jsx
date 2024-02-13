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
import { getEliminationColor } from '../hooks/usePaletteGenerator';

function Cell({
  color,
  tipContent = undefined,
  value,
  length,
  vertical = true,
  numeric,
  targetValue = 1,
  elimination,
}) {
  const trueColor =
    numeric && elimination && value > targetValue ? getEliminationColor(color) : color;
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
      onMouseEnter={(e) => tipContent && changeCellOffset(e, tipContent, value)}
      onMouseLeave={(e) => tipContent && hideTip()}
      onClick={(e) => {
        if (!tipContent) return;
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
        <CellNumericText small={vertical || length === 1} value={value} targetValue={targetValue} />
      )}
    </div>
  );
}

function CellFractured({
  color,
  tipContent = undefined,
  value,
  targetValue,
  length,
  vertical = true,
  elimination,
}) {
  const dispatch = useDispatch();
  const fractions = Math.max(value, targetValue);

  return (
    <div
      className={`cell fractured f${fractions} ${length > 1 ? 'long' : ''} ${vertical ? 'vertical' : ''}`}
      style={{ '--color': color, '--length': length }}
      onMouseEnter={(e) => tipContent && changeCellOffset(e, tipContent, value)}
      onMouseLeave={(e) => tipContent && hideTip()}
      onClick={(e) => {
        if (!tipContent) return;
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
      {[...Array(+fractions)].map((point, index) => (
        <div
          key={index}
          className="cell-fraction"
          style={{
            [index < value ? 'backgroundColor' : '']:
              index >= targetValue && elimination ? getEliminationColor(color) : color,
          }}
        />
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
  const tipContent = heatmapID
    ? {
        heatmapID,
        isPeriod: diffDays > 1 || differenceInHours(targetEnd, targetStart) > 24,
        dateStart: targetStart || dateStart,
        dateEnd: targetEnd || dateEnd,
        actions: value,
      }
    : undefined;
  if (isSameWeek(dateStart, dateEnd) || isOverview || !vertical) {
    return numeric || value > 16 || (value <= 1 && targetValue === 1) || targetValue > 16 ? (
      <Cell
        color={color}
        tipContent={tipContent}
        value={value}
        length={diffDays}
        vertical={vertical}
        numeric={numeric || value > 16 || (value === 0 && targetValue > 16)}
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
      ? getEliminationColor(color)
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
  const displayNumeric = value > 1 || (value === 0 && targetValue > 1) || numeric;

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
        {displayNumeric && !!width && (
          <CellNumericText wide={true} small={width <= 1} value={value} targetValue={targetValue} />
        )}
        <div className="cell-period-before centering" style={styleBefore}>
          {!width && diffDays <= 7 && displayNumeric && (
            <CellNumericText support={true} small={true} value={value} targetValue={targetValue} />
          )}
        </div>
        <div className="cell-period-after centering" style={styleAfter}>
          {!width && diffDays <= 7 && displayNumeric && (
            <CellNumericText support={true} small={true} value={value} targetValue={targetValue} />
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
            {!width && displayNumeric && (
              <CellNumericText value={value} targetValue={targetValue} />
            )}
          </div>
        )}
      </div>
      {afterHeight ? <CellDummy length={afterHeight} /> : <> </>}
    </>
  );
}

function CellNumericText({ support = false, wide = false, small = false, value, targetValue }) {
  const getHundredStyle = (displayedValue) => {
    if (!small || displayedValue < 100) return {};
    const stringValue = displayedValue.toString();
    const without1 = stringValue.indexOf('1') === -1;
    const single1 = !without1 && stringValue.indexOf('1') === stringValue.lastIndexOf('1');
    return {
      paddingTop: '2px',
      '--font-size-minus': '1px',
      [without1 ? 'marginLeft' : '']: '-1.75px',
      [without1 ? 'letterSpacing' : '']: '-0.75px',
      [single1 ? 'marginLeft' : '']: '-1.25px',
      [wide ? 'marginLeft' : '']: '-1.25px',
      [support ? 'marginLeft' : '']: '-0.5px',
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
