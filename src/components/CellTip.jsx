import React, { useState, useEffect } from 'react';
import { differenceInDays, formatISO } from 'date-fns';
import { useSelector } from 'react-redux';
import Icon from '@mdi/react';
import { mdiPlusBox, mdiMinusBox, mdiDelete } from '@mdi/js';
import { useDeleteCellPeriodMutation, useUpdateHeatmapMutation } from '../state/services/heatmap';

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

function changeCellOffset(e, tipContent, actions, override = false) {
  const cellTip = document.querySelector('.cell-tip');
  if (cellTip.classList.contains('fixated') && !override) return 0;
  const cell = e.target.classList.contains('cell-fraction') ? e.target.parentElement : e.target;
  const parent =
    document.querySelector('.habit') ||
    document.querySelector('.project-heatmap-container') ||
    document.querySelector('.overview-container');
  const rect = cell.getBoundingClientRect();
  const rectParent = parent.getBoundingClientRect();
  cellTip.firstChild.firstChild.textContent = `Actions: ${actions}`;
  const period = formatPeriod(tipContent.isPeriod, tipContent.dateStart, tipContent.dateEnd);
  cellTip.firstChild.nextSibling.textContent = `Period: ${period}`;
  const tipWidth = cellTip.getBoundingClientRect().width;
  let offset = tipWidth / 2 + 15;
  if (rect.x - 50 < rectParent.x || rect.x - 50 < 36) {
    offset = tipWidth / 4;
  } else if (rect.x - 100 < rectParent.x || rect.x - 100 < 36) {
    offset = tipWidth / 2;
  } else if (rect.x + 50 > rectParent.x + rectParent.width) {
    offset = tipWidth;
  } else if (rect.x + 100 > rectParent.x + rectParent.width) {
    offset = (tipWidth / 4) * 3;
  }
  cellTip.classList.remove('hidden');
  cellTip.style.top = `${window.pageYOffset + rect.y - 51}px`;
  cellTip.style.left = `${rect.x + rect.width / 2 - offset + 15}px`;
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
  useEffect(() => {
    document.addEventListener('click', unfixateAndHideCellTip);
    return () => document.removeEventListener('click', unfixateAndHideCellTip);
  });
  const { heatmapID, dateStart, dateEnd, actions } = useSelector((state) => state.cellTip);
  const [deleteCellPeriod] = useDeleteCellPeriodMutation();
  const [updateHeatmap] = useUpdateHeatmapMutation();

  return (
    <div
      className="cell-tip hidden"
      onMouseLeave={unfixateAndHideCellTip}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="cell-tip-actions">
        <p className="cell-tip-actions-text"></p>
        <div className="cell-tip-actions-controls">
          <button
            className="centering"
            title="Add 1 completed action in this period"
            onClick={() =>
              updateHeatmap({
                heatmapID,
                values: { date: formatISO(dateStart, { representation: 'date' }), value: 1 },
              })
            }
          >
            <Icon path={mdiPlusBox} className="icon tiny" />
          </button>
          <button className="centering" title="Delete 1 completed action in this period">
            <Icon path={mdiMinusBox} className="icon tiny" />
          </button>
          <button
            className="centering"
            title="Delete all actions in this period"
            onClick={() =>
              deleteCellPeriod({
                heatmapID,
                values: {
                  dateStart: formatISO(dateStart, { representation: 'date' }),
                  dateEnd: formatISO(dateEnd, { representation: 'date' }),
                  actions,
                },
              })
            }
          >
            <Icon path={mdiDelete} className="icon tiny" />
          </button>
        </div>
      </div>
      <p className="cell-tip-period"></p>
    </div>
  );
}

export { hideTip, formatDate, formatPeriod, changeCellOffset, fixateCellTip };
