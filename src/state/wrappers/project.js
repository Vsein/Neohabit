import { useState, useEffect } from 'react';
import { set, get } from 'idb-keyval';
import { useGetProjectsQuery as useGetProjectsQueryRTK } from '../services/project';
import isPWA from '../../utils/pwa';

function useGetProjectsQuery() {
  if (!isPWA()) {
    const habits = useGetProjectsQueryRTK();
    return habits;
  }
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    set('projects', []).then(() => {
      setIsLoading(false);
      setIsFetching(false);
    });
    get('projects').then((val) => setData(val));
  }, []);
  return { isLoading, isFetching, data };
}

export { useGetProjectsQuery };
