import { createSlice } from '@reduxjs/toolkit';
import { loadEmployeeDataToLocalStorage, removeEmployeeDataFromLocalStorage } from './authUtils';
import { authApi } from './authApi';

const initialState = {
  employee: loadEmployeeDataToLocalStorage(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      removeEmployeeDataFromLocalStorage();
      state.employee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.employee = payload;

        }
      )
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, { payload }) => {
          state.employee = payload;
        }
      );
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
