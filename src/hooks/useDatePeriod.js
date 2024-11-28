import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  startOfDay,
  isFirstDayOfMonth,
  isSameDay,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  subMonths,
  addMonths,
  subYears,
  addYears,
  addDays,
  differenceInDays,
  formatISO,
} from 'date-fns';
import { useGetSettingsQuery } from '../state/services/settings';
import useKeyPress from './useKeyPress';
import useWindowDimensions from './useWindowDimensions';
import { getISODate } from '../utils/dates';
import useValidatedDatePeriodParams from './useValidatedDatePeriodParams';

function getAdaptivePeriodLength(width, habit = false) {
  let minus = 0;
  if (width < 550) {
    // minus += 10;
  } else if (width < 1000) {
    minus += 30 + 85; // padding + sidebar
  } else {
    minus += 40 + 85; // padding + sidebar
  }
  if (habit) {
    return {
      adaptiveDatePeriodLength: Math.floor((width - minus - 40 - 10) / 19),
      mobile: width < 850,
    };
  }
  if (width < 850) {
    minus += 110 + 20 + 5;
  } else if (width < 1000) {
    minus += 200 + 120 + 10;
  } else {
    minus += 200 + 120 + 3;
  }
  const adaptiveDatePeriodLength = Math.floor((width - minus) / 19);
  return { adaptiveDatePeriodLength, mobile: width < 850 };
}

function useGetDatePeriodLength() {
  const settings = useGetSettingsQuery();

  const { width } = useWindowDimensions();
  const { adaptiveDatePeriodLength, mobile } = getAdaptivePeriodLength(width);
  const datePeriodLength =
    settings.data?.overview_adaptive ?? true
      ? Math.min(
          adaptiveDatePeriodLength,
          settings.data?.overview_apply_limit ?? true
            ? settings.data?.overview_duration_limit ?? 32
            : Infinity,
        )
      : settings.data?.overview_duration ?? 32;

  return { datePeriodLength, mobile, width };
}

export default function useDatePeriod(
  periodDuration,
  global = false,
  weekly = false,
  unsubscribed = false,
) {
  const settings = useGetSettingsQuery();
  const { width } = useWindowDimensions();
  const state =
    !weekly || !settings.data.habit_heatmaps_override
      ? settings.data.overview_current_day
      : settings.data.habit_heatmaps_current_day;
  const offset = settings.data.overview_offset ?? 0;

  const [searchParams, setSearchParams] = useSearchParams();
  const [firstRender, setFirstRender] = useState(true);
  const { dateStartURL, dateEndURL } = useValidatedDatePeriodParams();

  const curDate = startOfDay(new Date());

  const getStart = (neededState = state, date = curDate) => {
    if (!unsubscribed && firstRender && dateStartURL) {
      return startOfDay(dateStartURL);
    }

    if (weekly) {
      if (neededState === 'start') return startOfWeek(addDays(date, -offset));
      if (neededState === 'end')
        return startOfWeek(addDays(date, (-periodDuration + 1) * 7 + offset + 1));
      return startOfWeek(addDays(date, -Math.floor(periodDuration / 2) * 7 + offset));
    }
    if (neededState === 'start') return addDays(date, -offset);
    if (neededState === 'end') return addDays(date, -periodDuration + offset + 1);
    return addDays(date, -Math.floor(periodDuration / 2) + offset);
  };

  const getEnd = (neededState = state, date = curDate) => {
    if (!unsubscribed && firstRender && dateEndURL) {
      return startOfDay(dateEndURL);
    }

    if (weekly) {
      if (neededState === 'start')
        return startOfDay(endOfWeek(addDays(date, (periodDuration - 1) * 7 - offset - 1)));
      if (neededState === 'end') return startOfDay(endOfWeek(addDays(date, offset)));
      return startOfDay(
        endOfWeek(
          addDays(
            date,
            Math.floor(periodDuration / 2 - 1) * 7 + offset - 1 + (periodDuration % 2) * 7,
          ),
        ),
      );
    }
    if (neededState === 'start') return addDays(date, periodDuration - offset - 1);
    if (neededState === 'end') return addDays(date, offset);
    return addDays(date, Math.floor(periodDuration / 2) + offset - 1 + (periodDuration % 2));
  };

  const [dateStart, setDateStart] = useState(getStart());
  const [dateEnd, setDateEnd] = useState(getEnd());

  const setDateStartSafely = (newDateStart) => {
    setDateStart(newDateStart);

    if (global) {
      searchParams.set('from', getISODate(newDateStart));
      setSearchParams(searchParams);
    }
  };

  const setDateEndSafely = (newDateEnd) => {
    setDateEnd(newDateEnd);

    if (global) {
      searchParams.set('to', getISODate(newDateEnd));
      setSearchParams(searchParams);
    }
  };

  const setDatePeriod = (newDateStart, newDateEnd, revert = false) => {
    if (revert) {
      setDateEnd(newDateEnd);
      setDateStart(newDateStart);
    } else {
      setDateStart(newDateStart);
      setDateEnd(newDateEnd);
    }

    if (global) {
      const setGlobalDatePeriod = () => {
        if (revert) {
          searchParams.set('to', getISODate(newDateEnd));
          searchParams.set('from', getISODate(newDateStart));
        } else {
          searchParams.set('from', getISODate(newDateStart));
          searchParams.set('to', getISODate(newDateEnd));
        }
        setSearchParams(searchParams);
      };
      setGlobalDatePeriod();
    }
  };

  const subMonth = () => {
    const tmpStart = startOfMonth(
      isFirstDayOfMonth(dateStart) ? subMonths(dateStart, 1) : dateStart,
    );
    setDatePeriod(tmpStart, addDays(tmpStart, periodDuration - 1));
  };

  const addMonth = () => {
    const tmpStart = startOfMonth(addMonths(dateStart, 1));
    setDatePeriod(tmpStart, addDays(tmpStart, periodDuration - 1));
  };

  const subYear = () => {
    setDatePeriod(subYears(dateStart, 1), subYears(dateEnd, 1));
  };

  const addYear = () => {
    setDatePeriod(addYears(dateStart, 1), addYears(dateEnd, 1));
  };

  const subPeriod = () => {
    const period = differenceInDays(dateEnd, dateStart) + 1;
    setDatePeriod(addDays(dateStart, -period), addDays(dateEnd, -period));
  };

  const addPeriod = () => {
    const period = differenceInDays(dateEnd, dateStart) + 1;
    setDatePeriod(addDays(dateStart, period), addDays(dateEnd, period));
  };

  const setToPast = () => {
    setDatePeriod(getStart('end'), getEnd('end'), true);
  };

  const setToFuture = () => {
    setDatePeriod(getStart('start'), getEnd('start'));
  };

  const reset = (e, hard = false) => {
    if (hard) {
      setDatePeriod(getStart(), getEnd());
    } else {
      setDatePeriod(getStart('middle'), getEnd('middle'));
    }
  };

  const resetGracefully = () => {
    const diff = differenceInDays(dateEnd, dateStart) + 1;
    const dateMiddle = addDays(dateStart, diff / 2);
    setDatePeriod(getStart(state, dateMiddle), getEnd(state, dateMiddle));
  };

  if (global) {
    useKeyPress(['r'], reset);
    useKeyPress(['H'], subMonth);
    useKeyPress(['L'], addMonth);
    useKeyPress(['h'], subPeriod);
    useKeyPress(['l'], addPeriod);
  }

  useEffect(() => {
    if (!firstRender) {
      resetGracefully();
    }
  }, [width]);

  useEffect(() => {
    if (!firstRender && !unsubscribed) {
      if (
        dateStartURL &&
        dateEndURL &&
        (!isSameDay(dateStartURL, dateStart) || !isSameDay(dateEndURL, dateEnd))
      ) {
        setDateStart(startOfDay(dateStartURL));
        setDateEnd(startOfDay(dateEndURL));
      } else if (dateStartURL && !isSameDay(dateStartURL, dateStart)) {
        setDateStartSafely();
      } else if (dateEndURL && !isSameDay(dateEndURL, dateEnd)) {
        setDateEndSafely();
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const diff = differenceInDays(dateEnd, dateStart) + 1;
    if (diff > periodDuration && width >= 850 && !weekly) {
      document.documentElement.classList.add('overflow-visible');
    } else {
      document.documentElement.classList.remove('overflow-visible');
    }
    setFirstRender(false);
  }, [dateStart, dateEnd]);

  return [
    dateEnd,
    setDateEndSafely,
    dateStart,
    setDateStartSafely,
    { subMonth, addMonth, subYear, addYear, subPeriod, addPeriod, setToPast, setToFuture, reset },
  ];
}

function getUTCOffsettedDate(date = new Date()) {
  return formatISO(addDays(date, new Date().getTimezoneOffset() > 0 * 1), {
    representation: 'date',
  });
}

export { getAdaptivePeriodLength, useGetDatePeriodLength, getUTCOffsettedDate };
