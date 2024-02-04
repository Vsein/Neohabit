import { useState, useEffect } from 'react';
import { set, get } from 'idb-keyval';
import { useGetHeatmapsQuery as useGetHeatmapsQueryRTK } from '../services/heatmap';
import isPWA from '../../utils/pwa';

function useGetHeatmapsQuery() {
  if (!isPWA()) {
    const habits = useGetHeatmapsQueryRTK();
    return habits;
  }
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    set('heatmaps', []).then(() => {
      setIsLoading(false);
      setIsFetching(false);
    });
    get('heatmaps').then((val) => setData(val));
  }, []);
  return { isLoading, isFetching, data };
}

export { useGetHeatmapsQuery };
