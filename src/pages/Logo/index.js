import React, { useEffect } from 'react';

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
  let data = [];
  const periods = [gapStart + i * inc, gapLength, len - gapStart - gapLength - i * inc];
  data = data.concat(LineGap(start, periods[0]));
  data = data.concat(LineActiveRandom(start + data.length, periods[1]));
  data = data.concat(LineGap(start + data.length, periods[2]));
  return data;
}

function LineActiveStraight(start, len=14, width=1) {
  // returns a cell of height len. If len === 1, returns a square cell
  const dateEnd = new Date();
  const dateStart = new Date(new Date().setFullYear(dateEnd.getFullYear() - 1));
  return {
    date: new Date(
      new Date().setDate(dateStart.getDate() + start),
    ),
    value: randomRange(25, 100),
    height: len,
    width,
  };
}

function LineActiveRandom(start, len=14, height=1, width=1, min=Infinity) {
  const dataActive = [];
  let cnt = 0;
  for (let i = 0; i < len;) {
    const curLen = randomRange(1, Math.min(5, len - i, min));
    dataActive.push(LineActiveStraight(cnt + start, curLen));
    i += curLen;
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

function Logo() {
  let data = [];

  const len = 14;

  data = data.concat(Line(2, 10, 1, 0, data.length, len));
  data = data.concat(Line(1, 12, 1, 0, data.length, len));
  data = data.concat(Line(0, 14, 1, 0, data.length, len));

  for (let i = 0; i < 6; i++) {
    data = data.concat(Line(1, 7, 1, i, data.length, len));
  }

  data = data.concat(Line(0, 14, 1, 0, data.length, len));
  data = data.concat(Line(1, 12, 1, 0, data.length, len));
  data = data.concat(Line(2, 10, 1, 0, data.length, len));
  return data;
}

function Habits() {
  const dateEnd = new Date();
  const dateStart = new Date(new Date().setFullYear(dateEnd.getFullYear() - 1));
  const diffTime = Math.abs(dateStart - dateEnd);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let data = Logo();

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
