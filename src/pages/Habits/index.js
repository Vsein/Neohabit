import React, { useState, useEffect } from 'react';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { TimelineCells, TimelineMonthCells, TimelineWeekCells } from '../../components/Heatmap';
import { YearData } from '../../components/HeatmapData';
import {
  TimelineMonths,
  TimelineWeekdays,
} from '../../components/HeatmapHeaders';

export default function HabitsPage() {
  useEffect(() => {
    document.title = 'Habits | Neohabit';
  });

  return <Habits />;
}

function Habits() {
  const dateEnd = new Date();
  const dateStart = new Date(new Date().setFullYear(dateEnd.getFullYear() - 1));
  const minPeriod = 7;
  const dayLength = 1;

  // const data = Array.from(new Array(365)).map((_, index) => ({
  //   date: new Date(new Date().setDate(dateStart.getDate() + index)),
  //   value: Math.floor(Math.random() * 100),
  // }));

  // const data = YearData();

  const data = [
    {
      date: new Date(
        new Date().setTime(new Date().getTime() - 200 * 24 * 3.6e6),
      ),
      value: 500,
    },
    {
      date: new Date(
        new Date().setTime(new Date().getTime() - 190 * 24 * 3.6e6),
      ),
      value: 500,
    },
    {
      date: new Date(
        new Date().setTime(new Date().getTime() - 180 * 24 * 3.6e6),
      ),
      value: 150,
    },
    {
      date: new Date(
        new Date().setTime(new Date().getTime() - 170 * 24 * 3.6e6),
      ),
      value: 25,
    },
    {
      date: new Date(
        new Date().setTime(new Date().getTime() - 153 * 24 * 3.6e6),
      ),
      value: 100,
    },
    {
      date: new Date(
        new Date().setTime(new Date().getTime() - 152 * 24 * 3.6e6),
      ),
      value: 500,
    },
    {
      date: new Date(
        new Date().setTime(new Date().getTime() - 150 * 24 * 3.6e6),
      ),
      value: 500,
    },
    {
      date: new Date(
        new Date().setTime(new Date().getTime() - 148 * 24 * 3.6e6),
      ),
      value: 500,
    },
  ];

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
          minPeriod={minPeriod}
          dayLength={dayLength}
        />
        <h4>Habit</h4>
        <Timeline
          dateStart={dateStart}
          dateEnd={dateEnd}
          data={data}
          colorFunc={({ alpha }) => `rgba(220, 5,  3, ${alpha})`}
          minPeriod={minPeriod}
          dayLength={dayLength}
        />
        <h4>Habit</h4>
        <Timeline
          dateStart={dateStart}
          dateEnd={dateEnd}
          data={data}
          colorFunc={({ alpha }) => `rgba(5, 5,  200, ${alpha})`}
          minPeriod={minPeriod}
          dayLength={dayLength}
        />
        <button className="add-task-btn">
          <Icon className="add-task-icon" path={mdiPlus} />
          <p>Add habit</p>
        </button>
      </ul>
    </main>
  );
}

function Timeline({ dateStart, dateEnd, data, colorFunc, dayLength }) {
  return (
    <div className="timeline"
      // style={{ '--multiplier': dayLength}}
    >
      <div />
      <TimelineMonths dateStart={dateStart} />
      <TimelineWeekdays dateStart={dateStart} />
      <TimelineWeekCells
        data={data}
        colorFunc={colorFunc}
        dateStart={dateStart}
        dateEnd={dateEnd}
      />
    </div>
  );
}
