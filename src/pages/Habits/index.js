import React, { useState, useEffect } from 'react';
import Icon from '@mdi/react';
import { subYears } from 'date-fns';
import { mdiPlus } from '@mdi/js';
import {
  TimelineSimple,
  TimelineCells,
  TimelineMonthCells,
  TimelineWeekCells,
} from '../../components/Heatmap';
import { YearDataSimple, YearDataRandom, DATA1 } from '../../components/HeatmapData';

export default function HabitsPage() {
  useEffect(() => {
    document.title = 'Habits | Neohabit';
  });

  return <Habits />;
}

function Habits() {
  const dateEnd = new Date();
  const dateStart = subYears(dateEnd, 1);
  const dayLength = 1;

  return (
    <main className="habits">
      <div className="habits-header">
        <h3>Habits</h3>
      </div>
      <ul className="habits-list">
        <h4>Habit</h4>
        <TimelineSimple
          dateStart={dateStart}
          dateEnd={dateEnd}
          data={YearDataSimple(dateStart)}
          colorFunc={({ alpha }) => `rgba(3, 160, 3, ${alpha})`}
          dayLength={dayLength}
        />
        <h4>Habit</h4>
        <TimelineSimple
          dateStart={dateStart}
          dateEnd={dateEnd}
          data={YearDataRandom(dateStart)}
          colorFunc={({ alpha }) => `rgba(3, 160, 3, ${alpha})`}
          dayLength={dayLength}
        />
        <h4>Habit</h4>
        <TimelineCells
          dateStart={dateStart}
          dateEnd={dateEnd}
          data={[]}
          colorFunc={({ alpha }) => `rgba(220, 5,  3, ${alpha})`}
          dayLength={dayLength}
        />
        <h4>Habit</h4>
        <TimelineMonthCells
          data={DATA1}
          colorFunc={({ alpha }) => `rgba(5, 5,  200, ${alpha})`}
          dateStart={dateStart}
          dateEnd={dateEnd}
          dayLength={dayLength}
        />
        <h4>Habit</h4>
        <TimelineWeekCells
          data={DATA1}
          colorFunc={({ alpha }) => `rgba(220, 5,  3, ${alpha})`}
          dateStart={dateStart}
          dateEnd={dateEnd}
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
