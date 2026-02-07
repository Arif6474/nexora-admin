import { createSlice } from '@reduxjs/toolkit';
import { productApi } from './productApi';

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        productApi.endpoints.getProducts.matchFulfilled,
        (state, { payload }) => {
          state.products = payload.documents;
        }
      )
      .addMatcher(
        productApi.endpoints.getProducts.matchPending,
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        productApi.endpoints.getProducts.matchRejected,
        (state, { error }) => {
          state.loading = false;
          state.error = error.message;
        }
      );
  },
});

export default productSlice.reducer;
