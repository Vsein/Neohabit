import { useState, useEffect } from 'react';
import { set, get } from 'idb-keyval';
import { useGetHabitsQuery as useGetHabitsQueryRTK } from '../services/habit';
import isPWA from '../../utils/pwa';

function useGetHabitsQuery() {
  if (!isPWA()) {
    const habits = useGetHabitsQueryRTK();
    return habits;
  }
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    set('habits', []).then(() => {
      setIsLoading(false);
      setIsFetching(false);
    });
    get('habits').then((val) => setData(val));
  }, []);
  return { isLoading, isFetching, data };
}

export { useGetHabitsQuery };
