import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FORGOT_PASSWORD_API, GET_EMAIL_FROM_TOKEN_API, LOGIN_API, REGISTER_API, RESET_PASSWORD_API } from '../../../utils/APIs/AuthAPIs/AuthAPIs';
import { saveEmployeeDataToLocalStorage, removeEmployeeDataFromLocalStorage } from './authUtils';
import toast from 'react-hot-toast';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (employeeData) => ({
        url: LOGIN_API,
        method: 'POST',
        body: employeeData,
      }),
      transformResponse: (response) => {
        saveEmployeeDataToLocalStorage(response);
        return response;
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          setTimeout(() => {
            toast.success('Logged in successfully!');
          }, 2000);
        } catch (error) {
          removeEmployeeDataFromLocalStorage();
          const errorMessage = error?.error?.data?.message || 'Login failed. Please try again.';
          setTimeout(() => {
            toast.error(errorMessage);
          }, 2000);
        }
      },
    }),
    register: builder.mutation({
      query: (employeeData) => ({
        url: REGISTER_API,
        method: 'POST',
        body: employeeData,
      }),
      transformResponse: (response) => {
        saveEmployeeDataToLocalStorage(response);
        return response;
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          setTimeout(() => {
            toast.success('Registration successful!');
          }, 2000);
        } catch (error) {
          removeEmployeeDataFromLocalStorage();
          const errorMessage = error?.error?.data?.message || 'Registration failed. Please try again.';
          setTimeout(() => {
            toast.error(errorMessage);
          }, 2000);
        }
      },
    }),
    getEmailFromToken: builder.query({
      query: ({ token }) => ({
        url: `${GET_EMAIL_FROM_TOKEN_API}${token}`
      }),

    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: FORGOT_PASSWORD_API,
        method: 'POST',
        body: email,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          setTimeout(() => {
            toast.success('Password reset link sent!');
          }, 2000);
        } catch (error) {
          const errorMessage = error?.error?.data?.message || 'Password reset failed. Please try again.';
          setTimeout(() => {
            toast.error(errorMessage);
          }, 2000);
        }
      },
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: RESET_PASSWORD_API,
        method: 'PATCH',
        body: { token, newPassword },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          setTimeout(() => {
            toast.success('Password reset successfully!');
          }, 2000);
        } catch (error) {
          const errorMessage = error?.error?.data?.message || 'Password reset failed. Please try again.';
          setTimeout(() => {
            toast.error(errorMessage);
          }, 2000);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetEmailFromTokenQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
