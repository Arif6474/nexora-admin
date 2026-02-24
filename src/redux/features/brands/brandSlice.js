import { createSlice } from '@reduxjs/toolkit';
import { brandApi } from './brandApi';

const brandSlice = createSlice({
    name: 'brand',
    initialState: {
        brands: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(
                brandApi.endpoints.getBrands.matchFulfilled,
                (state, { payload }) => {
                    state.brands = payload;
                }
            )
            .addMatcher(
                brandApi.endpoints.getBrands.matchPending,
                (state) => {
                    state.loading = true;
                }
            )
            .addMatcher(
                brandApi.endpoints.getBrands.matchRejected,
                (state, { error }) => {
                    state.loading = false;
                    state.error = error.message;
                }
            );
    },
});

export default brandSlice.reducer;
