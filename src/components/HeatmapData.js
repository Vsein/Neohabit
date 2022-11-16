// It's not really a component right now, just some helper functions for generating stuff
import { addDays } from 'date-fns';

function random() {
  return Math.floor(Math.random() * 100);
}

function randomRange(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

function LineActiveStraight(start, len = 14, width = 1) {
  // returns a cell of height len. If len === 1, returns a square cell
  const dateEnd = new Date();
  const dateStart = new Date(new Date().setFullYear(dateEnd.getFullYear() - 1));
  return {
    date: new Date(
      new Date().setTime(dateStart.getTime() + start * 24 * 3.6e6),
    ),
    value: randomRange(25, 100),
    height: len,
    width,
  };
}
function LineGapStraight(start, len = 14, width = 1) {
  // returns an inactive cell of height len. If len === 1, returns a square cell
  const dateEnd = new Date();
  const dateStart = new Date(new Date().setFullYear(dateEnd.getFullYear() - 1));
  return {
    date: new Date(new Date().setDate(dateStart.getDate() + start)),
    value: -1,
    height: len,
    width,
  };
}

function LineActiveRandom(
  start,
  len = 14,
  height = 1,
  width = 1,
  min = Infinity,
) {
  const dataActive = [];
  let cnt = 0;
  for (let i = 0; i < len; ) {
    const curLen = randomRange(1, Math.min(5, len - i, min));
    dataActive.push(LineActiveStraight(cnt + start, curLen));
    i += curLen;
    cnt++;
  }
  return dataActive;
}

function LineGapRandom(start, len = 14) {
  const dataGap = [];
  let cnt = 0;
  for (let i = 0; i < len; ) {
    const curLen = randomRange(1, Math.min(5, len - i, min));
    dataGap.push(LineGapStraight(cnt + start, curLen));
    i += curLen;
    cnt++;
  }
  return dataGap;
}

function LineRandom(start, len = 14) {
  const data = [];
  let cnt = 0;
  for (let i = 0; i < len; ) {
    if (cnt % 2) {
      const curLen = randomRange(1, Math.min(1, len - i));
      data.push(LineGapStraight(cnt + start, curLen));
      i += curLen;
    } else {
      const curLen = randomRange(1, Math.min(14, len - i));
      data.push(LineActiveStraight(cnt + start, curLen));
      i += curLen;
    }
    cnt++;
  }
  return data;
}

function LineGap(start, len = 14) {
  const dateEnd = new Date();
  const dateStart = new Date(new Date().setFullYear(dateEnd.getFullYear() - 1));
  const dataActive = Array.from(new Array(len)).map((_, index) => ({
    date: new Date(new Date().setDate(dateStart.getDate() + index + start)),
    value: 0,
    height: 1,
    width: 1,
  }));
  return dataActive;
}

function Line(gapStart, gapLength, inc, i, start, len = 14) {
  let data = [];
  const periods = [
    gapStart + i * inc,
    gapLength,
    len - gapStart - gapLength - i * inc,
  ];
  data = data.concat(LineGap(start, periods[0]));
  data = data.concat(LineActiveRandom(start + data.length, periods[1]));
  // data = data.concat(LineRandom(start + data.length, periods[1]));
  data = data.concat(LineGap(start + data.length, periods[2]));
  return data;
}

function Logo() {
  let data = [];

  const len = 14;

  data = data.concat(Line(0, 14, 1, 0, data.length, len));
  data = data.concat(Line(0, 14, 1, 0, data.length, len));
  data = data.concat(Line(0, 14, 1, 0, data.length, len));

  for (let i = 0; i < 6; i++) {
    data = data.concat(Line(1, 7, 1, i, data.length, len));
  }

  data = data.concat(Line(0, 14, 1, 0, data.length, len));
  data = data.concat(Line(0, 14, 1, 0, data.length, len));
  data = data.concat(Line(0, 14, 1, 0, data.length, len));
  return data;
}

function YearDataSimple(dateStart) {
  const data = Array.from(new Array(365)).map((_, index) => ({
    date: addDays(dateStart, index),
    value: Math.floor(Math.random() * 100),
  }));

  return data;
}

function YearDataRandom() {
  let data = [];
  const len = 7;

  data = data.concat(LineActiveRandom(data.length, 7 - new Date().getDay()));
  for (let i = 1; i < 52; i++) {
    data = data.concat(LineActiveRandom(data.length, len));
  }
  data = data.concat(LineActiveRandom(data.length, new Date().getDay() + 1));

  return data;
}

const DATA1 = [
  {
    date: new Date(new Date().setTime(new Date().getTime() - 200 * 24 * 3.6e6)),
    value: 500,
  },
  {
    date: new Date(new Date().setTime(new Date().getTime() - 190 * 24 * 3.6e6)),
    value: 500,
  },
  {
    date: new Date(new Date().setTime(new Date().getTime() - 180 * 24 * 3.6e6)),
    value: 150,
  },
  {
    date: new Date(new Date().setTime(new Date().getTime() - 170 * 24 * 3.6e6)),
    value: 25,
  },
  {
    date: new Date(new Date().setTime(new Date().getTime() - 153 * 24 * 3.6e6)),
    value: 100,
  },
  {
    date: new Date(new Date().setTime(new Date().getTime() - 152 * 24 * 3.6e6)),
    value: 500,
  },
  {
    date: new Date(new Date().setTime(new Date().getTime() - 150 * 24 * 3.6e6)),
    value: 500,
  },
  {
    date: new Date(new Date().setTime(new Date().getTime() - 148 * 24 * 3.6e6)),
    value: 500,
  },
];

export {
  LineActiveStraight,
  LineActiveRandom,
  LineGap,
  Line,
  Logo,
  YearDataSimple,
  YearDataRandom,
  DATA1,
};
