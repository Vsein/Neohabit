import React, { useEffect } from 'react';
import { differenceInDays } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@mdi/react';
import {
  mdiPlusBox,
  mdiMinusBox,
  mdiDelete,
  mdiCheckboxBlankOutline,
  mdiInformation,
} from '@mdi/js';
import {
  useCreateHabitDataPointMutation,
  useDeleteAllHabitDataPointsBetweenDatesMutation,
  useReduceHabitDataPointsBetweenDatesByAmountMutation,
} from '../state/services/habitData';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../state/services/settings';
import { changeCellActions } from '../state/features/cellTip/cellTipSlice';
import adjustTooltip from '../utils/adjustTooltip';

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

function formatPeriod(isPeriod, dateStart, dateEnd = undefined) {
  const formattedDateStart = formatDate(dateStart);
  let period = formattedDateStart;
  if (isPeriod) {
    const formattedDateEnd = formatDate(dateEnd);
    period += ` - ${formattedDateEnd}`;
    period += ` (${differenceInDays(dateEnd, dateStart) + 1} days)`;
  }
  return period;
}

function setCellTipActions(actions) {
  document.querySelector('#cell-tip-actions-counter').value = actions;
}

function getParentCell(cell) {
  if (cell.classList.contains('cell-fraction') || cell.classList.contains('cell-numeric')) {
    return cell.parentElement.parentElement.matches('.cell-period')
      ? cell.parentElement.parentElement
      : cell.parentElement;
  }
  return cell.parentElement.matches('.cell-period') ? cell.parentElement : cell;
}

function changeCellOffset(e, tipContent, actions, override = false) {
  const cellTip = document.querySelector('.cell-tip');
  if (cellTip.classList.contains('fixated') && !override) return 0;
  const cell = getParentCell(e.target);
  const parent =
    document.querySelector('.habit-heatmap-container') ||
    document.querySelector('.overview-container');
  const rect = cell.getBoundingClientRect();
  const rectParent = parent.getBoundingClientRect();
  setCellTipActions(actions);
  const period = formatPeriod(tipContent.isPeriod, tipContent.dateStart, tipContent.dateEnd);
  cellTip.firstChild.nextSibling.textContent = `Period: ${period}`;
  cellTip.classList.remove('hidden');
  cellTip.style.top = `${
    window.pageYOffset + rect.y - 51 - 42 * !cellTip.classList.contains('hint-hidden')
  }px`;

  adjustTooltip(cellTip, rect, rectParent);
  return 0;
}

function hideTip() {
  const cellTip = document.querySelector('.cell-tip');
  if (cellTip.classList.contains('fixated')) return 0;
  cellTip.classList.add('hidden');
  cellTip.style.top = '0px';
  return 0;
}

function fixateCellTip(e) {
  e.stopPropagation();
  const cellTip = document.querySelector('.cell-tip');
  cellTip.classList.add('fixated');
}

function unfixateAndHideCellTip() {
  const cellTip = document.querySelector('.cell-tip');
  cellTip.classList.remove('fixated');
  hideTip();
}

export default function CellTip() {
  const dispatch = useDispatch();
  useEffect(() => {
    document.addEventListener('click', unfixateAndHideCellTip);
    return () => document.removeEventListener('click', unfixateAndHideCellTip);
  });
  const { habitID, dateStart, dateEnd, actions } = useSelector((state) => state.cellTip);
  const [deleteAllHabitDataPointsBetweenDates] = useDeleteAllHabitDataPointsBetweenDatesMutation();
  const [reduceHabitDataPointsBetweenDatesByAmount] =
    useReduceHabitDataPointsBetweenDatesByAmountMutation();
  const [createHabitDataPoint] = useCreateHabitDataPointMutation();
  const settings = useGetSettingsQuery();
  const hintHidden = settings.data.hide_cell_hint;
  const [updateSettings] = useUpdateSettingsMutation();

  return (
    <div
      className={`cell-tip hidden ${hintHidden ? 'hint-hidden' : ''}`}
      onMouseLeave={unfixateAndHideCellTip}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="cell-tip-actions">
        <p className="cell-tip-actions-text">Actions:</p>
        <div className="cell-tip-actions-controls">
          <button
            className="centering"
            title="Delete 1 completed action in this period"
            onClick={() => {
              if (actions > 0) {
                reduceHabitDataPointsBetweenDatesByAmount({
                  habitID,
                  values: {
                    period_start: new Date(dateStart),
                    period_end: new Date(dateEnd),
                    amount: 1,
                  },
                });
              }
              setCellTipActions(Math.max(actions - 1, 0));
              dispatch(changeCellActions({ actions: Math.max(actions - 1, 0) }));
            }}
          >
            <Icon path={mdiMinusBox} className="icon tiny" />
          </button>
          <input
            id="cell-tip-actions-counter"
            size="3"
            type="number"
            min="0"
            onMouseLeave={(e) => e.target.blur()}
            onBlur={(e) => {
              const diff = +e.target.value - actions;
              if (diff > 0) {
                createHabitDataPoint({
                  habitID,
                  values: { date: new Date(dateStart), value: diff },
                });
              } else if (diff < 0) {
                reduceHabitDataPointsBetweenDatesByAmount({
                  habitID,
                  values: {
                    period_start: new Date(dateStart),
                    period_end: new Date(dateEnd),
                    amount: -diff,
                  },
                });
              }
              setCellTipActions(+e.target.value);
              dispatch(changeCellActions({ actions: +e.target.value }));
            }}
          ></input>
          <button
            className="centering"
            title="Add 1 completed action in this period"
            onClick={() => {
              createHabitDataPoint({
                habitID,
                values: { date: new Date(dateStart), value: 1 },
              });
              setCellTipActions(actions + 1);
              dispatch(changeCellActions({ actions: actions + 1 }));
            }}
          >
            <Icon path={mdiPlusBox} className="icon tiny" />
          </button>
          <button
            className="centering"
            title="Delete all actions in this period"
            style={{ marginLeft: '3px' }}
            onClick={() => {
              deleteAllHabitDataPointsBetweenDates({
                habitID,
                values: {
                  period_start: new Date(dateStart),
                  period_end: new Date(dateEnd),
                },
              });
              setCellTipActions(0);
              dispatch(changeCellActions({ actions: 0 }));
            }}
          >
            <Icon path={mdiDelete} className="icon tiny" />
          </button>
        </div>
      </div>
      <p className="cell-tip-period"></p>
      {!hintHidden && (
        <>
          <hr />
          <div className="cell-tip-i">
            <Icon path={mdiInformation} className="icon tiny" />
            <div>
              <p className="cell-tip-period">Click to access this window</p>
              <div className="cell-tip-i-hide">
                <button
                  className="centering"
                  onClick={() => updateSettings({ values: { hide_cell_hint: true } })}
                >
                  <Icon path={mdiCheckboxBlankOutline} className="icon smol" />
                </button>
                <p>Don&apos;t show again</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export { hideTip, formatDate, formatPeriod, changeCellOffset, fixateCellTip };
