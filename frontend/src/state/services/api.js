import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: window.APP_CONFIG.DEMO ? '/mock_api' : window.APP_CONFIG.API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // tagTypes: ['Heatmaps'],
  tagTypes: ['HabitsOutsideProjects'],
  endpoints: () => ({}),
});

export default api;
