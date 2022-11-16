import React, { useEffect } from 'react';
import { Logo } from '../../components/HeatmapData';

export default function HabitsPage() {
  useEffect(() => {
    document.title = 'Logo | Neohabit';
  });

  return <Habits />;
}

function Habits() {
  const data = Logo();
  const dateEnd = new Date();
  const dateStart = new Date(new Date().setYear(dateEnd.getFullYear() - 1));
  console.log(dateStart);
  console.log(data);

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
              new Date().setDate(dateStart.getDate() + index - 365),
            );
            const dataPoint = data.find((d) => isSameDay(date, d.date));
            const value = dataPoint ? dataPoint.value : 0;
            const height = dataPoint ? dataPoint.height : 1;
            const width = dataPoint ? dataPoint.width : 1;
            const alpha = colorMultiplier * value;
            const color = colorFunc({ alpha });
            // const alpha = (value !== 0 ? colorMultiplier * height : 0);
            // const alpha = (value !== 0 ? colorMultiplier * 14 : 0);
            // const color = (value !== -1 ? colorFunc({ alpha }) : '#ccc');

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
