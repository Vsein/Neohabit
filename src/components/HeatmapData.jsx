// It's not really a component right now, just some helper functions for generating stuff
import {
  addDays,
  subDays,
  addWeeks,
  subYears,
  addMonths,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  startOfDay,
} from 'date-fns';

function randomRange(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

function LineActiveStraight(start, len = 14, width = 1) {
  // returns a cell of height len. If len === 1, returns a square cell
  const dateEnd = new Date();
  const dateStart = subYears(dateEnd, 1);
  return {
    date: addDays(dateStart, start),
    value: randomRange(25, 100),
    height: len,
    width,
  };
}
function LineGapStraight(start, len = 14, width = 1) {
  // returns an inactive cell of height len. If len === 1, returns a square cell
  const dateEnd = new Date();
  const dateStart = subYears(dateEnd, 1);
  return {
    date: addDays(dateStart, start),
    value: -1,
    height: len,
    width,
  };
}

function LineActiveRandom(
  start,
  len = 14,
  min = Infinity,
  height = 1,
  width = 1,
) {
  const dataActive = [];
  let cnt = 0;
  for (let i = 0; i < len;) {
    // const curLen = 17;
    const curLen = randomRange(1, Math.min(5, len - i, min));
    dataActive.push(LineActiveStraight(cnt + start, curLen));
    i += curLen;
    cnt++;
  }
  dataActive[dataActive.length - 1].value = dataActive[0].value;
  // console.log(dataActive);
  return dataActive;
}

function LineGapRandom(start, len = 14) {
  const dataGap = [];
  let cnt = 0;
  for (let i = 0; i < len;) {
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
  for (let i = 0; i < len;) {
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
  const dateStart = subYears(dateEnd, 1);
  const dataActive = Array.from(new Array(len)).map((_, index) => ({
    date: addDays(dateStart, start + index),
    value: 0,
    height: 1,
    width: 1,
  }));
  return dataActive;
}

function Line(gapStart, gapLength, inc, i, start, len = 14, min = Infinity) {
  let data = [];
  const periods = [
    gapStart + i * inc,
    gapLength,
    len - gapStart - gapLength - i * inc,
  ];
  data = data.concat(LineGap(start, periods[0]));
  data = data.concat(LineActiveRandom(start + data.length, periods[1], min));
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

function LogoMini() {
  let data = [];

  data = data.concat(Line(0, 4, 1, 0, data.length, 4, 1));
  data = data.concat(Line(1, 1, 1, 0, data.length, 4));
  data = data.concat(Line(2, 1, 1, 0, data.length, 4));
  data = data.concat(Line(0, 4, 1, 0, data.length, 4, 1));

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

function LotsOfRandom() {
  const data = [];
  const len = 51;

  // data = data.concat(LineActiveRandom(data.length, 5000));

  // data = data.concat(LineActiveRandom(data.length, len - new Date().getDay()));
  let dataLength = 0;
  for (let i = 0; i < 100; i++) {
    data[i] = LineActiveRandom(dataLength, len);
    dataLength += data.length;
  }
  // data = data.concat(LineActiveRandom(data.length, new Date().getDay() + 1));

  return data;
}

const DATA1 = [
  {
    date: subDays(new Date(), 200),
    value: 500,
  },
  {
    date: subDays(new Date(), 190),
    value: 500,
  },
  {
    date: subDays(new Date(), 180),
    value: 150,
  },
  {
    date: subDays(new Date(), 170),
    value: 25,
  },
  {
    date: subDays(new Date(), 153),
    value: 100,
  },
  {
    date: subDays(new Date(), 152),
    value: 500,
  },
  {
    date: subDays(new Date(), 150),
    value: 500,
  },
  {
    date: subDays(new Date(), 140),
    value: 500,
  },
];

const dateYearBefore = startOfDay(subYears(new Date(), 1));

const PERIODS1 = [
  {
    date: dateYearBefore,
    frequency: 24,
  },
  {
    date: new Date(),
  },
];

const PERIODS2 = Array.from(new Array(14)).map((_, index) => ({
  date: startOfMonth(addMonths(dateYearBefore, index)),
}));

const PERIODS3 = [
  {
    date: dateYearBefore,
  },
  {
    date: new Date(),
  },
];

const PERIODS4 = [
  {
    date: startOfWeek(dateYearBefore),
    frequency: 24 * 7,
  },
  {
    date: new Date(),
  },
];

const PERIODS5 = [
  {
    date: dateYearBefore,
    frequency: 12,
  },
  {
    date: addWeeks(dateYearBefore, 3),
    frequency: 24,
  },
  {
    date: addWeeks(dateYearBefore, 7),
    frequency: 24 * 7,
  },
  {
    date: addWeeks(dateYearBefore, 7),
    frequency: 24 * 7,
  },
  {
    date: new Date(),
  },
];

let len = 0;
const PERIODS6 = Array.from(new Array(130)).map((_, index) => {
  if (index === 129) {
    return {
      date: new Date(),
    };
  }
  const curLen = randomRange(1, 5);
  len += curLen;
  return {
    date: addDays(startOfWeek(dateYearBefore), len),
  };
});

let curPeriod = 0;
const PERIODS7 = Array.from(new Array(36)).map((_, index) => {
  if (index === 34) {
    return {
      date: new Date(),
    };
  }
  curPeriod += 12;
  return {
    date: addWeeks(startOfDay(dateYearBefore), index),
    frequency: curPeriod,
  };
});

export {
  LineActiveStraight,
  LineActiveRandom,
  LineGap,
  Line,
  Logo,
  LogoMini,
  YearDataSimple,
  YearDataRandom,
  LotsOfRandom,
  DATA1,
  PERIODS1,
  PERIODS2,
  PERIODS3,
  PERIODS4,
  PERIODS5,
  PERIODS6,
  PERIODS7,
};
