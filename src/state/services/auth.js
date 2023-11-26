import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const hasJWT = () => {
  const token = localStorage.getItem('token');
  return token || false;
};

const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.REACT_APP_STAGE === 'dev'
        ? 'http://localhost:9000/'
        : 'https://neohabit.app/api',
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (values) => ({
        url: 'login',
        body: values,
        method: 'POST',
      }),
      async onQueryStarted(values, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        localStorage.setItem('token', res.data.token);
      },
    }),
    signup: builder.mutation({
      query: (values) => ({
        url: 'signup',
        body: values,
        method: 'POST',
      }),
    }),
  }),
});

export default authApi;

export const { useLoginMutation, useSignupMutation } = authApi;
