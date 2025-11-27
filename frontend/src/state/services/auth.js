import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import isPWA from '../../utils/pwa';

export const hasJWT = () => {
  const token = localStorage.getItem('token');
  // return token || isPWA();
  return token;
};

const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.REACT_APP_STAGE === 'dev' ? 'http://localhost:9000/' : 'https://neohabit.app/api',
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (values) => ({
        url: 'login',
        body: values,
        method: 'POST',
      }),
      async onQueryStarted(values, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          localStorage.setItem('token', res.data.token);
        } catch (err) {
          console.log('Login failed');
        }
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
