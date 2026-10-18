import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TESTIMONIAL_API } from '../../../utils/APIs/APIs';

export const testimonialApi = createApi({
    reducerPath: 'testimonialApi',
    baseQuery: fetchBaseQuery({
        baseUrl: TESTIMONIAL_API,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.employee?.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({
        getTestimonials: builder.query({
            query: ({ search = '', filter, queryParams }) => ({
                url: '/getTestimonialWithQuery',
                params: {
                    search,
                    filter,
                    currentPage: queryParams?.currentPage,
                    limit: queryParams?.limit,
                },
            }),
        }),
        createTestimonial: builder.mutation({
            query: (testimonialData) => ({
                url: '/',
                method: 'POST',
                body: testimonialData,
            }),
        }),
        updateTestimonial: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body: updatedData,
            }),
        }),
        singleTestimonial: builder.query({
            query: ({ id }) => ({
                url: `/getSingleTestimonial/${id}`,
            }),
        }),
        deleteTestimonial: builder.mutation({
            query: ({ id }) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetTestimonialsQuery,
    useCreateTestimonialMutation,
    useUpdateTestimonialMutation,
    useSingleTestimonialQuery,
    useDeleteTestimonialMutation,
} = testimonialApi;
