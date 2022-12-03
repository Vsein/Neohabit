import React from 'react';
import { Heatmap } from '../../components/Heatmap';
import { subYears, startOfDay } from 'date-fns';
import { YearDataSimple, PERIODS6 } from '../../components/HeatmapData';

export default function Project() {
  const dateEnd = startOfDay(new Date());
  const dateStart = subYears(dateEnd, 1);
  const dayLength = 2;
  const yearData = YearDataSimple(dateStart);

  return (
    <div className="project-overview">
      <Heatmap
        data={yearData}
        dataPeriods={PERIODS6}
        colorFunc={({ alpha }) => `rgba(3, 160, 3, ${alpha})`}
        dateStart={dateStart}
        dateEnd={dateEnd}
        dayLength={dayLength}
        useElimination={false}
      />
    </div>
  );
}
