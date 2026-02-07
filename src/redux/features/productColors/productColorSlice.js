import { createSlice } from '@reduxjs/toolkit';
import { productColorApi } from './productColorApi';

const productColorSlice = createSlice({
  name: 'productColor',
  initialState: {
    productColors: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        productColorApi.endpoints.getProductColors.matchFulfilled,
        (state, { payload }) => {
          state.productColors = payload;
        }
      )
      .addMatcher(
        productColorApi.endpoints.getProductColors.matchPending,
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        productColorApi.endpoints.getProductColors.matchRejected,
        (state, { error }) => {
          state.loading = false;
          state.error = error.message;
        }
      );
  },
});

export default productColorSlice.reducer;
