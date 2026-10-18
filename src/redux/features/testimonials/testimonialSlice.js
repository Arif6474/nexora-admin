import { createSlice } from '@reduxjs/toolkit';
import { testimonialApi } from './testimonialApi';

const testimonialSlice = createSlice({
    name: 'testimonial',
    initialState: {
        testimonials: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(
                testimonialApi.endpoints.getTestimonials.matchFulfilled,
                (state, { payload }) => {
                    state.testimonials = payload;
                }
            )
            .addMatcher(
                testimonialApi.endpoints.getTestimonials.matchPending,
                (state) => {
                    state.loading = true;
                }
            )
            .addMatcher(
                testimonialApi.endpoints.getTestimonials.matchRejected,
                (state, { error }) => {
                    state.loading = false;
                    state.error = error.message;
                }
            );
    },
});

export default testimonialSlice.reducer;
