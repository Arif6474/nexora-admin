import { createSlice } from '@reduxjs/toolkit';
import { productSizeApi } from './productSizeApi';

const productSizeSlice = createSlice({
  name: 'productSize',
  initialState: {
    productSizes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        productSizeApi.endpoints.getAllProductSizes.matchPending,
        (state) => {
          state.loading = true;
        }
      )

  },
});

export default productSizeSlice.reducer;
