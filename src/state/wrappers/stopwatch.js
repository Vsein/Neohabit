import { useState, useEffect } from 'react';
import { set, get } from 'idb-keyval';
import { useGetStopwatchQuery as useGetStopwatchQueryRTK } from '../services/stopwatch';
import isPWA from '../../utils/pwa';

function useGetStopwatchQuery() {
  if (!isPWA()) {
    const settings = useGetStopwatchQueryRTK();
    return settings;
  }
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    set('stopwatch', {
      habit: { },
      is_initiated: false,
      start_time: Date.now(),
      duration: 0,
      is_paused: true,
      pause_duration: 0,
    }).then(() => {
      setIsLoading(false);
      setIsFetching(false);
    });
    get('stopwatch').then((val) => setData(val));
  }, []);
  return { isLoading, isFetching, data };
}

export { useGetStopwatchQuery };
