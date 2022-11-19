import React, { useState, useEffect } from 'react';
import Icon from '@mdi/react';
import { subYears, addWeeks } from 'date-fns';
import { mdiPlus } from '@mdi/js';
import {
  Heatmap,
} from '../../components/Heatmap';
import {
  YearDataSimple,
  YearDataRandom,
  DATA1,
  PERIODS1,
  PERIODS2,
  PERIODS5,
  PERIODS4,
  PERIODS3,
  PERIODS6,
  PERIODS7,
} from '../../components/HeatmapData';

export default function HabitsPage() {
  useEffect(() => {
    document.title = 'Habits | Neohabit';
  });

  return <Habits />;
}

function Habits() {
  const dateEnd = new Date();
  const dateStart = subYears(dateEnd, 1);
  const dayLength = 2;

  const getGreenPalette = ({ alpha }) => {
    if (alpha < 0.2) return '#C2E1C4';
    if (alpha < 0.4) return '#8CC276';
    if (alpha < 0.6) return '#61BF5A';
    if (alpha < 0.8) return '#3AB03B';
    return '#069F02';
  };

  return (
    <main className="habits">
      <div className="habits-header">
        <h3>Habits</h3>
      </div>
      <ul className="habits-list">
        <Heatmap
          data={YearDataSimple(dateStart)}
          dataPeriods={PERIODS1}
          colorFunc={({ alpha }) => `rgba(3, 160, 3, ${alpha})`}
          dateStart={dateStart}
          dateEnd={dateEnd}
          dayLength={dayLength}
          useElimination={false}
        />
        <Heatmap
          data={YearDataSimple(dateStart)}
          dataPeriods={PERIODS6}
          colorFunc={({ alpha }) => `rgba(3, 160, 3, ${alpha})`}
          dateStart={dateStart}
          dateEnd={dateEnd}
          dayLength={dayLength}
          useElimination={false}
        />
        <Heatmap
          data={[]}
          dataPeriods={PERIODS3}
          colorFunc={({ alpha }) => `rgba(220, 5,  3, ${alpha})`}
          dateStart={dateStart}
          dateEnd={dateEnd}
          dayLength={dayLength}
          useElimination={false}
        />
        <Heatmap
          data={DATA1}
          dataPeriods={PERIODS2}
          colorFunc={({ alpha }) => `rgba(5, 5,  200, ${alpha})`}
          dateStart={dateStart}
          dateEnd={dateEnd}
          dayLength={dayLength}
          useElimination={false}
        />
        <Heatmap
          data={DATA1}
          dataPeriods={PERIODS4}
          colorFunc={({ alpha }) => `rgba(220, 5,  3, ${alpha})`}
          dateStart={dateStart}
          dateEnd={dateEnd}
          dayLength={dayLength}
          useElimination={false}
        />
        <Heatmap
          data={DATA1}
          dataPeriods={PERIODS7}
          colorFunc={getGreenPalette}
          dateStart={dateStart}
          dateEnd={dateEnd}
          dayLength={dayLength}
        />
        <Heatmap
          data={DATA1}
          dataPeriods={PERIODS5}
          colorFunc={getGreenPalette}
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
