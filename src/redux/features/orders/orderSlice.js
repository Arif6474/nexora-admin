import { createSlice } from '@reduxjs/toolkit';
import { orderApi } from './orderApi'; // Import the orderApi

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [], // To store all the orders
    loading: false, // Loading state
    error: null, // Error state
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handling the "getAllOrders" endpoint fulfillment
    builder.addMatcher(
      orderApi.endpoints.getOrders.matchFulfilled,
      (state, { payload }) => {
        state.orders = payload; // Store the fetched orders in state
        state.loading = false;
      }
    );

}  
});

export default orderSlice.reducer;