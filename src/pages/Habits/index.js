import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
// import Habits from './Habits';
import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { YearData } from '../../components/Heatmap';

export default function HabitsPage() {
  useEffect(() => {
    document.title = 'Habits | Neohabit';
  });

  return <Habits />;
}

function Habits() {
  const dateEnd = new Date();
  const dateStart = new Date(new Date().setFullYear(dateEnd.getFullYear() - 1));
  const diffTime = Math.abs(dateStart - dateEnd);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // const data = Array.from(new Array(365)).map((_, index) => ({
  //   date: new Date(new Date().setDate(dateStart.getDate() + index)),
  //   value: Math.floor(Math.random() * 100),
  // }));

  const data = YearData();

  return (
    <main className="habits">
      <div className="habits-header">
        <h3>Habits</h3>
      </div>
      <ul className="habits-list">
        <h4>Habit</h4>
        <Timeline
          dateStart={dateStart}
          dateEnd={dateEnd}
          data={data}
          colorFunc={({ alpha }) => `rgba(3, 160, 3, ${alpha})`}
        />
        <h4>Habit</h4>
        <Timeline
          dateStart={dateStart}
          dateEnd={dateEnd}
          data={data}
          colorFunc={({ alpha }) => `rgba(220, 5,  3, ${alpha})`}
        />
        <h4>Habit</h4>
        <Timeline
          dateStart={dateStart}
          dateEnd={dateEnd}
          data={data}
          colorFunc={({ alpha }) => `rgba(5, 5,  200, ${alpha})`}
        />
        <button className="add-task-btn">
          <Icon className="add-task-icon" path={mdiPlus} />
          <p>Add habit</p>
        </button>
      </ul>
      <Outlet />
    </main>
  );
}

const DayNames = {
  1: 'Mon',
  3: 'Wed',
  5: 'Fri',
};

function Cell({ color, date, value, height = 1, width = 1 }) {
  const style = {
    backgroundColor: color,
    height: 11 * height + 2 * 2 * (height - 1),
    width: 11 * width + 2 * 2 * (width - 1),
  };
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
      className="timeline-cells-cell"
      style={style}
      data-attr={content}
      onMouseEnter={changeCellOffset}
    />
  );
}

function Month({ dateStart, index }) {
  const date = new Date(new Date().setDate(dateStart.getDate() + index * 7));
  const monthName = date.toLocaleString('en-US', { month: 'short' });

  return (
    <div className={`timeline-months-month ${monthName}`}>{monthName}</div>
  );
}

function WeekDay({ index }) {
  return <div className="timeline-weekdays-weekday">{DayNames[index]}</div>;
}

function Timeline({ dateStart, dateEnd, data, colorFunc }) {
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
    <div className="timeline">
      <div className="timeline-months">
        {months.map((_, index) => (
          <Month key={index} index={index} dateStart={dateStart} />
        ))}
      </div>

      <div className="timeline-body">
        <div className="timeline-weekdays">
          {weekDays.map((_, index) => (
            <WeekDay key={index} index={index} dateStart={dateStart} />
          ))}
        </div>

        <div className="timeline-cells">
          {Array.from(new Array(data[0].date.getDay())).map((_, index) => (
            <Cell key={index} color="#00000000" date="" />
          ))}
          {cells.map((_, index) => {
            const date = new Date(
              new Date().setDate(dateStart.getDate() + index),
            );
            const dataPoint = data.find((d) => isSameDay(date, d.date));
            const value = dataPoint ? dataPoint.value : 0;
            const alpha = colorMultiplier * value;
            const height = dataPoint ? dataPoint.height : 1;
            const width = dataPoint ? dataPoint.width : 1;
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
