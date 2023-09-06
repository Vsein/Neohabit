import React, { useState, useEffect } from 'react';

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

function formatTipContent(values) {
  let content;
  if (!values.actions) {
    content = 'No activity on ';
  } else if (values.actions === 1) {
    content = '1 action on ';
  } else {
    content = `${values.actions} actions on `;
  }
  if (values.period) {
    const formattedDateStart = formatDate(values.dateStart);
    const formattedDateEnd = formatDate(values.dateEnd);
    content += `${formattedDateStart} - ${formattedDateEnd}`;
  } else {
    const formattedDate = formatDate(values.dateStart);
    content += `${formattedDate}`;
  }
  return content;
}

function changeCellOffset(e, content) {
  const cell = e.target.classList.contains('cell-fraction') ? e.target.parentElement : e.target;
  const parent = document.querySelector('.habit') || document.querySelector('.project-heatmap-container') || document.querySelector('.overview-container');
  const rect = cell.getBoundingClientRect();
  const rectParent = parent.getBoundingClientRect();
  const cellTip = document.querySelector('.cell-tip');
  cellTip.textContent = content;
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
  cellTip.style.top = `${window.pageYOffset + rect.y - 40}px`;
  cellTip.style.left = `${rect.x + rect.width / 2 - offset + 15}px`;
  cellTip.style.pointerEvents = 'none';
}

function hideTip() {
  const cellTip = document.querySelector('.cell-tip');
  cellTip.classList.add('hidden');
  cellTip.style.pointerEvents = 'auto';
  cellTip.style.top = '0px';
}

export default function CellTip() {
  useEffect(() => {
    document.addEventListener('click', hideTip);
    return () => document.removeEventListener('click', hideTip);
  });

  return <div className="cell-tip hidden"></div>;
}

export { hideTip, formatDate, formatTipContent, changeCellOffset };
