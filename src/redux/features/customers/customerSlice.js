import { createSlice } from '@reduxjs/toolkit';
import { customerApi } from './customerApi';

const customerSlice = createSlice({
    name: 'customer',
    initialState: {
        customers: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(
                customerApi.endpoints.getCustomers.matchFulfilled,
                (state, { payload }) => {
                    state.customers = payload;
                }
            )
            .addMatcher(
                customerApi.endpoints.getCustomers.matchPending,
                (state) => {
                    state.loading = true;
                }
            )
            .addMatcher(
                customerApi.endpoints.getCustomers.matchRejected,
                (state, { error }) => {
                    state.loading = false;
                    state.error = error.message;
                }
            );
    },
});

export default customerSlice.reducer;
