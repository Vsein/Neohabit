import React from 'react';
import Icon from '@mdi/react';
import { subYears, startOfDay } from 'date-fns';
import { mdiPlus } from '@mdi/js';
import { Heatmap } from '../../components/Heatmap';
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
import useTitle from '../../hooks/useTitle';
import useLoaded from '../../hooks/useLoaded';

export default function Habits() {
  useTitle('Habits | Neohabit');
  const [loaded] = useLoaded();
  const dateEnd = startOfDay(new Date());
  const dateStart = subYears(dateEnd, 1);
  const dayLength = 2;
  const green = '#03A003';
  const red = '#DC0503';
  const blue = '#0505C8';
  const green2 = '#069F02';

  const getGreenPalette = ({ alpha }) => {
    if (alpha < 0.2) return '#C2E1C4';
    if (alpha < 0.4) return '#8CC276';
    if (alpha < 0.6) return '#61BF5A';
    if (alpha < 0.8) return '#3AB03B';
    return '#069F02';
  };
  const yearData = YearDataSimple(dateStart);

  return loaded && (
    <main className="habits">
      <div className="habits-header">
        <h3>Habits</h3>
      </div>
      <ul className="habits-list">
        <Heatmap
          data={yearData}
          dataPeriods={PERIODS1}
          color={green}
          dateStart={dateStart}
          dateEnd={dateEnd}
          dayLength={dayLength}
          useElimination={false}
        />
        <Heatmap
          data={yearData}
          dataPeriods={PERIODS6}
          color={green}
          dateStart={dateStart}
          dateEnd={dateEnd}
          dayLength={dayLength}
          useElimination={false}
        />
        <Heatmap
          data={[]}
          dataPeriods={PERIODS3}
          color={red}
          dateStart={dateStart}
          dateEnd={dateEnd}
          dayLength={dayLength}
          useElimination={false}
        />
        <Heatmap
          data={DATA1}
          dataPeriods={PERIODS2}
          color={blue}
          dateStart={dateStart}
          dateEnd={dateEnd}
          dayLength={dayLength}
          useElimination={false}
        />
        <Heatmap
          data={DATA1}
          dataPeriods={PERIODS4}
          color={red}
          dateStart={dateStart}
          dateEnd={dateEnd}
          dayLength={dayLength}
          useElimination={false}
        />
        <Heatmap
          data={DATA1}
          dataPeriods={PERIODS7}
          color={green2}
          dateStart={dateStart}
          dateEnd={dateEnd}
          dayLength={dayLength}
        />
        <Heatmap
          data={DATA1}
          dataPeriods={PERIODS5}
          color={green2}
          dateStart={dateStart}
          dateEnd={dateEnd}
          dayLength={dayLength}
        />
        {/* <button className="add-task-btn"> */}
        {/*   <Icon className="add-task-icon" path={mdiPlus} /> */}
        {/*   <p>Add habit</p> */}
        {/* </button> */}
      </ul>
    </main>
  );
}
