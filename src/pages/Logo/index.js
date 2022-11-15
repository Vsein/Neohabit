import React, { useEffect } from 'react';
import { Logo } from '../../components/Heatmap';

export default function HabitsPage() {
  useEffect(() => {
    document.title = 'Logo | Neohabit';
  });

  return <Habits />;
}

function Habits() {
  const dateEnd = new Date();
  const dateStart = new Date(new Date().setFullYear(dateEnd.getFullYear() - 1));
  const diffTime = Math.abs(dateStart - dateEnd);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const data = Logo();

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
