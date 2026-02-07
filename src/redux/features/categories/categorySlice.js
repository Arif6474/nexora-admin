import { createSlice } from '@reduxjs/toolkit';
import { categoryApi } from './categoryApi';

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        categoryApi.endpoints.getCategories.matchFulfilled,
        (state, { payload }) => {
          state.categories = payload;
        }
      )
      .addMatcher(
        categoryApi.endpoints.getCategories.matchPending,
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        categoryApi.endpoints.getCategories.matchRejected,
        (state, { error }) => {
          state.loading = false;
          state.error = error.message;
        }
      );
  },
});

export default categorySlice.reducer;
