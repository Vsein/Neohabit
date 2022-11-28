import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const todolistApi = createApi({
  reducerPath: 'todolistApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:9000/api/' }),
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => ({
        url: `projects`,
        params: { secret_token: localStorage.getItem('token') },
      })
    }),
    getFilters: builder.query({
      query: () => ({
        url: 'filters',
        params: { secret_token: localStorage.getItem('token') },
      })
    }),
    getTasks: builder.query({
      query: () => ({
        url: 'tasks',
        params: { secret_token: localStorage.getItem('token') },
      })
    }),
  }),
})

export const { useGetProjectsQuery, useGetFiltersQuery, useGetTasksQuery } = todolistApi;
