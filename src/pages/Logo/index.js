import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
// import Habits from './Habits';
import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';

export default function HabitsPage() {
  useEffect(() => {
    document.title = 'Habits | Neohabit';
  });

  return <Habits />;
}

function random() {
  return Math.floor(Math.random() * 100);
}

function randomRange(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

function Line(gapStart, gapLength, inc, i, start, len=14) {
  const dateEnd = new Date();
  const dateStart = new Date(new Date().setFullYear(dateEnd.getFullYear() - 1));
  let data = [];
  const periods = [gapStart + i * inc, gapLength, len - gapStart - gapLength - i * inc];
  data = data.concat(LineGap(start, periods[0]));
  data = data.concat(LineActive(start + periods[0], periods[1]));
  data = data.concat(LineGap(start + periods[0] + periods[1], periods[2]));
  return data;
}

function LineActive(start, len=14) {
  const dateEnd = new Date();
  const dateStart = new Date(new Date().setFullYear(dateEnd.getFullYear() - 1));
  const dataActive = Array.from(new Array(len)).map((_, index) => ({
    date: new Date(
      new Date().setDate(dateStart.getDate() + index + start),
    ),
    value: randomRange(25, 100),
  }));
  return dataActive;
}

function LineGap(start, len=14) {
  const dateEnd = new Date();
  const dateStart = new Date(new Date().setFullYear(dateEnd.getFullYear() - 1));
  const dataActive = Array.from(new Array(len)).map((_, index) => ({
    date: new Date(
      new Date().setDate(dateStart.getDate() + index + start),
    ),
    value: 0,
  }));
  return dataActive;
}

function Habits() {
  const dateEnd = new Date();
  const dateStart = new Date(new Date().setFullYear(dateEnd.getFullYear() - 1));
  const diffTime = Math.abs(dateStart - dateEnd);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let data = [];

  const len = 14;

  data = data.concat(LineActive(data.length, len));
  data = data.concat(LineActive(data.length, len));
  data = data.concat(LineActive(data.length, len));

  for (let i = 0; i < 6; i++) {
    data = data.concat(Line(1, 7, 1, i, data.length, len));
  }

  data = data.concat(LineActive(data.length, len));
  data = data.concat(LineActive(data.length, len));
  data = data.concat(LineActive(data.length, len));

  return (
    <main className="logonh">
      <Timeline
        dateStart={dateStart}
        dateEnd={dateEnd}
        data={data}
        colorFunc={({ alpha }) => `rgba(3, 160, 3, ${alpha})`}
      />
      <div className="logonh-container">
        <h1 className="logo neohabit" />
      </div>
      <Outlet />
    </main>
  );
}

const DayNames = {
  1: 'Mon',
  3: 'Wed',
  5: 'Fri',
};

function Cell({ color, date, value }) {
  const style = { backgroundColor: color };
  const formattedDate = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  function changeCellOffset(e) {
    const cell = e.target;
    const parent = e.target.parentElement;
    const rect = cell.getBoundingClientRect();
    const rectParent = parent.getBoundingClientRect();
    if (rect.x - 50 < rectParent.x || rect.x - 50 < 36) {
      cell.classList.add('offset--2');
    } else if (rect.x - 100 < rectParent.x || rect.x - 100 < 36) {
      cell.classList.add('offset--1');
    } else if (rect.x + 50 > rectParent.x + rectParent.width) {
      cell.classList.add('offset-2');
    } else if (rect.x + 100 > rectParent.x + rectParent.width) {
      cell.classList.add('offset-1');
    }
  }

  let content;
  if (!value) {
    content = `No activity on ${formattedDate}`;
  } else if (value === 1) {
    content = `1 action on ${formattedDate}`;
  } else {
    content = `${value} actions on ${formattedDate}`;
  }

  return (
    <div
      className="timeline-logo-cells-cell"
      style={style}
      data-attr={content}
      onMouseEnter={changeCellOffset}
    />
  );
}

function Timeline({ dateStart, dateEnd, data, colorFunc }) {
  console.log(data.length);
  const cells = Array.from(new Array(data.length));
  const weekDays = Array.from(new Array(7));
  const months = Array.from(new Array(Math.floor(data.length / 7)));

  const min = Math.min(0, ...data.map((d) => d.value));
  const max = Math.max(...data.map((d) => d.value));

  const colorMultiplier = 1 / (max - min);

  const isSameDay = (dateToCheck, actualDate) =>
    dateToCheck.getDate() === actualDate.getDate() &&
    dateToCheck.getMonth() === actualDate.getMonth() &&
    dateToCheck.getFullYear() === actualDate.getFullYear();

  return (
    <div className="timeline-logo">

      <div className="timeline-logo-body">
        <div className="timeline-logo-cells">
          {/* {Array.from(new Array(data[0].date.getDay())).map((_, index) => ( */}
          {/*   <Cell key={index} color="#00000000" date="" /> */}
          {/* ))} */}
          {cells.map((_, index) => {
            const date = new Date(
              new Date().setDate(dateStart.getDate() + index),
            );
            const dataPoint = data.find((d) => isSameDay(date, d.date));
            const value = dataPoint ? dataPoint.value : 0;
            const alpha = colorMultiplier * dataPoint.value;
            const color = colorFunc({ alpha });

            return (
              <Cell
                key={index}
                index={index}
                value={value}
                date={date}
                color={color}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
