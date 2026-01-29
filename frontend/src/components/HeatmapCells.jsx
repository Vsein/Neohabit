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

function Cell({
  tipContent = undefined,
  value,
  length,
  vertical = true,
  numeric,
  targetIndex = null,
  targetValue = 1,
  elimination,
  monochromatic,
  dummy = false,
}) {
  const applyEliminationColor = numeric && elimination && value > targetValue;
  const dispatch = useDispatch();
  const style = {
    [value && monochromatic ? '--value' : '']: value,
    [vertical ? '--width' : '--height']: 1,
    [vertical ? '--height' : '--width']: length,
  };

  return (
    <div
      className={`cell centering-flex ${dummy ? 'dummy' : ''} ${
        (value >= 100 || (value === 0 && targetValue >= 100)) && !monochromatic ? 'hundred' : ''
      } ${value ? 'nonzero' : ''} ${monochromatic && value ? 'monochromatic' : ''}
      ${applyEliminationColor ? 'elimination' : ''} ${typeof targetIndex === 'number' ? `target-${targetIndex}` : ''}
      `}
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
        <CellNumericText width={vertical ? 1 : length} value={value} targetValue={targetValue} />
      )}
    </div>
  );
}

function CellFractured({
  tipContent = undefined,
  value,
  targetIndex = null,
  targetValue,
  length,
  vertical = true,
  elimination,
  dummy = false,
}) {
  const dispatch = useDispatch();
  const fractions = Math.max(value, targetValue);

  return (
    <div
      className={`cell fractured f${fractions} ${dummy ? 'dummy' : ''} ${length > 1 ? 'long' : ''} ${vertical ? 'vertical' : ''} ${typeof targetIndex === 'number' ? `target-${targetIndex}` : ''}`}
      style={{ '--length': length }}
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
      {[...Array(+fractions)].map((_, index) => (
        <div
          key={index}
          className={`cell-fraction ${index < value ? 'nonzero' : ''} ${index >= targetValue && elimination ? 'elimination' : ''}`}
        />
      ))}
    </div>
  );
}

function CellPeriod({
  habitID = '',
  dateStart,
  dateEnd,
  dummy = false,
  value = 0,
  basePeriod = 24,
  vertical = true,
  targetIndex = null,
  targetValue = 1,
  targetStart = undefined,
  targetEnd = undefined,
  elimination = false,
  monochromatic = false,
  numeric = false,
  is2D = false,
}) {
  const dispatch = useDispatch();
  const diffDays = differenceInHours(addMilliseconds(dateEnd, 1), dateStart) / basePeriod;
  if (diffDays < 1) {
    return <></>;
  }
  const tipContent = habitID
    ? {
        habitID,
        isPeriod: diffDays > 1 || differenceInHours(targetEnd, targetStart) > 24,
        dateStart: targetStart || dateStart,
        dateEnd: targetEnd || dateEnd,
        actions: value,
      }
    : undefined;
  const showNumberInCell = !monochromatic && (numeric || value > 16 || targetValue > 16);
  if (isSameWeek(dateStart, dateEnd) || !is2D || !vertical) {
    return showNumberInCell || monochromatic ? (
      <Cell
        tipContent={tipContent}
        value={value}
        length={diffDays}
        vertical={vertical}
        numeric={showNumberInCell}
        targetValue={targetValue}
        targetIndex={targetIndex}
        elimination={elimination}
        monochromatic={monochromatic}
        dummy={dummy}
      />
    ) : (
      <CellFractured
        tipContent={tipContent}
        value={value}
        targetValue={targetValue}
        targetIndex={targetIndex}
        length={diffDays}
        vertical={vertical}
        elimination={elimination}
        dummy={dummy}
      />
    );
  }

  const applyEliminationColor =
    (value > 1 || numeric) && !dummy && elimination && value > targetValue;

  let width = differenceInCalendarWeeks(dateEnd, dateStart) - 1;
  width += dateStart.getTime() === startOfWeek(dateStart).getTime();
  width += dateEnd.getTime() === endOfWeek(dateEnd).getTime();
  const style = {
    [value && monochromatic ? '--value' : '']: value,
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
    visibility: afterHeight !== 0 ? 'visible' : 'hidden',
  };

  const showNumberInCellPeriod =
    !monochromatic && (showNumberInCell || value > 1 || (value === 0 && targetValue > 1));

  return (
    <>
      <div
        className={`cell-period centering-flex ${width ? 'wide' : 'hollow'} ${dummy ? 'dummy' : ''} ${
          (value >= 100 || (value === 0 && targetValue >= 100)) && !monochromatic ? 'hundred' : ''
        } ${value ? 'nonzero' : ''} ${monochromatic && value ? 'monochromatic' : ''}
      ${applyEliminationColor ? 'elimination' : ''} ${typeof targetIndex === 'number' ? `target-${targetIndex}` : ''}
    `}
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
        {showNumberInCellPeriod && !!width && (
          <CellNumericText wide width={width} value={value} targetValue={targetValue} />
        )}
        <div className="cell-period-before centering-flex" style={styleBefore}>
          {!width && diffDays <= 7 && showNumberInCellPeriod && (
            <CellNumericText support width={1} value={value} targetValue={targetValue} />
          )}
        </div>
        <div className="cell-period-after centering-flex" style={styleAfter}>
          {!width && diffDays <= 7 && showNumberInCellPeriod && (
            <CellNumericText support width={1} value={value} targetValue={targetValue} />
          )}
        </div>
        {diffDays > 7 && !width && (
          <div
            className="cell-period-connector centering-flex"
            style={{
              '--height': afterHeight - (7 - beforeHeight),
              '--offset-top': 7 - beforeHeight,
            }}
          >
            {!width && showNumberInCellPeriod && (
              <CellNumericText width={1} value={value} targetValue={targetValue} />
            )}
          </div>
        )}
      </div>
      {afterHeight ? <CellDummy length={afterHeight} /> : <> </>}
    </>
  );
}

const toNDigits = (number, digits) => Math.trunc(number * 10 ** digits) / 10 ** digits;

const suffixes = [
  { value: 1, symbol: '' },
  { value: 1e3, symbol: 'k' },
  { value: 1e6, symbol: 'M' },
  { value: 1e9, symbol: 'B' },
];

function nFormatter(num, length) {
  const numDigitsN = num.toString().length;
  if (length === 2) {
    if (num >= 10_000 && num < 1e6) return `${toNDigits(num / 1000, 6 - numDigitsN).toString()}k`;
    if (num >= 1e6 && num < 1e7) return `${toNDigits(num / 1000, 7 - numDigitsN).toString()}k`;
    if (num >= 1e7 && num < 1e9) return `${toNDigits(num / 1e6, 9 - numDigitsN).toString()}M`;
    if (num >= 1e9) return `${toNDigits(num / 1e9, 12 - numDigitsN).toString()}B`;
  }
  if (num >= 1_000_000 && num < 1e9 && length >= 3) {
    return `${toNDigits(num / 1e6, 10 - numDigitsN).toString()}M`;
  }
  if (num >= 1e9 && length >= 3) {
    return `${toNDigits(num / 1e9, 13 - numDigitsN).toString()}B`;
  }
  if (num < 1e6 && numDigitsN <= 3 + 2 * (length - 1))
    return Intl.NumberFormat('en-US').format(num);

  const isAboveHundred = Number(num >= 1e5 && numDigitsN % 3 === 0);
  const i = suffixes.findLastIndex((s) => num >= s.value) + isAboveHundred;
  const item = suffixes[i];

  if (num < 1e4) {
    return toNDigits(num / item.value, 1)
      .toString()
      .concat(item.symbol);
  }

  if (num < 1e5) {
    return toNDigits(num / item.value, 0)
      .toString()
      .concat(item.symbol);
  }

  return toNDigits(num / item.value, isAboveHundred)
    .toString()
    .concat(item.symbol);
}

const getThousandStyle = (displayedValue, width) => {
  if (width > 2 && displayedValue > 1e6) return { '--font-size-minus': '-2px' };
  if (width > 1 && displayedValue > 1e3) return { '--font-size-minus': '-1px' };
  const stringValue = displayedValue.toString();
  const stringValueLength = stringValue.toString().length;

  const hasKDecimals =
    displayedValue >= 1000 && displayedValue <= 10_000 && Math.floor((displayedValue / 100) % 10);
  const hundredK = displayedValue >= 100_000 && displayedValue < 1_000_000;
  const hasMAnd1Digit = displayedValue >= 1_000_000 && displayedValue < 100_000_000;
  const hasMAnd2Digits = displayedValue >= 10_000_000 && displayedValue < 100_000_000;
  const millionAsBDecimal = displayedValue >= 1e8 && displayedValue < 1e9;

  return {
    [displayedValue % 1000 >= 1 && displayedValue % 1000 < 100 ? 'marginLeft' : '']: '1px',
    [displayedValue >= 100_000 && stringValueLength % 3 === 0 ? '--font-size-minus' : '']: '2.5px',
    [displayedValue >= 1000 && stringValueLength % 3 === 1 ? '--font-size-minus' : '']: '-2px',
    [displayedValue >= 1000 && stringValueLength % 3 === 2 ? '--font-size-minus' : '']: '1.5px',
    [hasMAnd1Digit ? '--font-size-minus' : '']: '5%',
    ...(hasMAnd2Digits || hundredK || hasKDecimals || millionAsBDecimal
      ? {
          marginTop: '3px',
          '--font-size-minus': '15%',
        }
      : {}),
    [displayedValue >= 100000 ? 'fontWeight' : '']: '2px',
  };
};

const getHundredStyle = (displayedValue, width, wide, support) => {
  if (displayedValue >= 1000) return getThousandStyle(displayedValue, width);
  if (width > 1) return { '--font-size-minus': '-1px' };
  const stringValue = displayedValue.toString();
  const without1 = stringValue.indexOf('1') === -1;
  const single1 = !without1 && stringValue.indexOf('1') === stringValue.lastIndexOf('1');
  return {
    marginTop: '2px',
    '--font-size-minus': '1px',
    [without1 ? 'marginLeft' : '']: '-1.75px',
    [without1 ? 'letterSpacing' : '']: '-0.75px',
    [single1 ? 'marginLeft' : '']: '1px',
    [wide ? 'marginLeft' : '']: '-1.25px',
    [support ? 'marginLeft' : '']: '-0.5px',
  };
};

function CellNumericText({ support = false, wide = false, value, targetValue, width = 1 }) {
  if (value) {
    return (
      <p
        className="cell-numeric"
        style={value >= 100 ? getHundredStyle(value, width, support, wide) : {}}
      >
        {nFormatter(value, width)}
      </p>
    );
  }
  return targetValue > 1 ? (
    <p
      className="cell-numeric target"
      style={targetValue >= 100 ? getHundredStyle(targetValue, width, support, wide) : {}}
    >
      {nFormatter(targetValue, width)}
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
