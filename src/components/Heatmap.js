// It's not really a component right now, just some helper functions for generating stuff

function random() {
  return Math.floor(Math.random() * 100);
}

function randomRange(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
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

function Line(gapStart, gapLength, inc, i, start, len=14) {
  let data = [];
  const periods = [gapStart + i * inc, gapLength, len - gapStart - gapLength - i * inc];
  data = data.concat(LineGap(start, periods[0]));
  data = data.concat(LineActiveRandom(start + data.length, periods[1]));
  data = data.concat(LineGap(start + data.length, periods[2]));
  return data;
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

function YearData() {
  let data = [];

  const len = 7;

  for (let i = 0; i < 100; i++) {
    data = data.concat(LineActiveRandom(data.length, 14));
  }

  return data;
}

export {
  LineActiveStraight,
  LineActiveRandom,
  LineGap,
  Line,
  Logo,
  YearData,
};
