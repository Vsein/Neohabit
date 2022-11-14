import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
// import Habits from './Habits';
import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';

export default function HabitsPage() {
  useEffect(() => {
    document.title = 'Logo | Neohabit';
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
  // const periods = [gapStart + i * inc, gapLength / 7, len - gapStart - gapLength - i * inc];
  const periods = [gapStart + i * inc, gapLength, len - gapStart - gapLength - i * inc];
  data = data.concat(LineGap(start, periods[0]));
  // data = data.concat(LineActive(start + periods[0], periods[1], 7));
  // data = data.concat(LineActiveRandom(start + data.length, periods[1]));
  data = data.concat(LineActiveRandom(start + data.length, periods[1]));
  data = data.concat(LineGap(start + data.length, periods[2]));
  return data;
}

function LineActive(start, len=14, height=1, width=1) {
  const dateEnd = new Date();
  const dateStart = new Date(new Date().setFullYear(dateEnd.getFullYear() - 1));
  const dataActive = Array.from(new Array(len)).map((_, index) => ({
    date: new Date(
      new Date().setDate(dateStart.getDate() + index + start),
    ),
    value: randomRange(25, 100),
    height,
    width,
  }));
  return dataActive;
}

function LineActiveStraight(start, len=14, width=1) {
  const dateEnd = new Date();
  const dateStart = new Date(new Date().setFullYear(dateEnd.getFullYear() - 1));
  const dataActive = Array.from(new Array(1)).map((_, index) => ({
    date: new Date(
      new Date().setDate(dateStart.getDate() + index + start),
    ),
    value: randomRange(25, 100),
    height: len,
    width,
  }));
  return dataActive;
}

function LineActiveRandom(start, len=14, height=1, width=1) {
  const dateEnd = new Date();
  const dateStart = new Date(new Date().setFullYear(dateEnd.getFullYear() - 1));
  let dataActive = [];
  let cnt = 0;
  for (let i = 0; i < len;) {
    const curLen = randomRange(1, Math.min(5, len - i));
    i += curLen;
    dataActive.push({
      date: new Date(
        new Date().setDate(dateStart.getDate() + cnt + start),
      ),
      value: randomRange(60, 100),
      height: curLen,
      width,
    });
    cnt++;
  }
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
    height: 1,
    width: 1,
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

  // data = data.concat(LineActiveRandom(data.length, 14));
  // data = data.concat(LineActiveRandom(data.length, 14));
  // data = data.concat(LineActiveRandom(data.length, 14));
  // data = data.concat(Line(data.length, 14));
  // data = data.concat(Line(data.length, 14));
  // data = data.concat(Line(data.length, 14));
  data = data.concat(Line(2, 10, 1, 0, data.length, len));
  data = data.concat(Line(1, 12, 1, 0, data.length, len));
  data = data.concat(Line(0, 14, 1, 0, data.length, len));
  // data = data.concat(LineActive(data.length, 1, 14));

  for (let i = 0; i < 6; i++) {
    data = data.concat(Line(1, 7, 1, i, data.length, len));
  }

  data = data.concat(Line(0, 14, 1, 0, data.length, len));
  data = data.concat(Line(1, 12, 1, 0, data.length, len));
  data = data.concat(Line(2, 10, 1, 0, data.length, len));
  // data = data.concat(LineActiveRandom(data.length, 14));
  // data = data.concat(LineActiveRandom(data.length, 14));
  // data = data.concat(LineActiveRandom(data.length, 14));
  // data = data.concat(LineActive(data.length, 1, 14));
  // data = data.concat(LineActive(data.length, 1, 14));
  // data = data.concat(LineActive(data.length, 1, 14));
  // data = data.concat(LineActive(data.length, len));
  // data = data.concat(LineActive(data.length, len));
  // data = data.concat(LineActive(data.length, len));

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

function Cell({ color, date, value, height, width }) {
  const style = {
    backgroundColor: color,
    height: 11 * height + 2 * 2 * (height - 1),
    width: 11 * width + 2 * 2 * (width - 1),
  };
  return (
    <div
      className="timeline-logo-cells-cell"
      style={style}
    />
  );
}

function Timeline({ dateStart, dateEnd, data, colorFunc }) {
  console.log(data.length);
  const cells = Array.from(new Array(data.length));

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
          {cells.map((_, index) => {
            const date = new Date(
              new Date().setDate(dateStart.getDate() + index),
            );
            const dataPoint = data.find((d) => isSameDay(date, d.date));
            const value = dataPoint ? dataPoint.value : 0;
            const height = dataPoint ? dataPoint.height : 1;
            const width = dataPoint ? dataPoint.width : 1;
            const alpha = colorMultiplier * value;
            const color = colorFunc({ alpha });

            return (
              <Cell
                key={index}
                index={index}
                value={value}
                date={date}
                height={height}
                width={width}
                color={color}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
