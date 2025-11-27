import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.REACT_APP_STAGE === 'dev'
        ? 'http://localhost:9000/private/'
        : 'https://neohabit.app/api/private',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Heatmaps'],
  endpoints: () => ({}),
});

export default api;
