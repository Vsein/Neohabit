import { useState, useEffect } from 'react';
import { set, get } from 'idb-keyval';
import {
  useGetSelfQuery as useGetSelfQueryRTK,
  useGetSettingsQuery as useGetSettingsQueryRTK,
} from '../services/settings';
import isPWA from '../../utils/pwa';

function useGetSelfQuery() {
  if (!isPWA()) {
    const self = useGetSelfQueryRTK();
    return self;
  }
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    set('self', { username: 'unregistered', email: 'not registered' }).then(() => {
      setIsLoading(false);
      setIsFetching(false);
    });
    get('self').then((val) => setData(val));
  }, []);
  return { isLoading, isFetching, data };
  // return get('habits').then((val) => console.log(val));
}

function useGetSettingsQuery() {
  if (!isPWA()) {
    const settings = useGetSettingsQueryRTK();
    return settings;
  }
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    set('settings', {
      prefer_dark: false,
      cell_height_multiplier: 1,
      cell_width_multiplier: 1,
      overview_vertical: false,
      overview_current_is_first: false,
      overview_current_day: 'middle',
      overview_duration: 45,
      overview_offset: 0,
      overview_adaptive: true,
      overview_apply_limit: false,
      overview_duration_limit: 45,
      stopwatch_title: true,
      hide_cell_hint: false,
      hide_onboarding: true,
    }).then(() => {
      setIsLoading(false);
      setIsFetching(false);
    });
    get('settings').then((val) => setData(val));
  }, []);
  return { isLoading, isFetching, data };
}

export { useGetSelfQuery, useGetSettingsQuery };
