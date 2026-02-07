import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { COLOR_API } from '../../../utils/APIs/APIs';

export const colorApi = createApi({
    reducerPath: 'colorApi',
    baseQuery: fetchBaseQuery({
        baseUrl: COLOR_API,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.employee?.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({
        getColors: builder.query({
            query: ({ search = '', filter, queryParams }) => ({
                url: '/getColorWithQuery',
                params: {
                    search, filter,
                    currentPage: queryParams?.currentPage || 1,
                    limit: queryParams?.limit || 10,
                },
            }),
        }),
        createColor: builder.mutation({
            query: (colorData) => ({
                url: '/',
                method: 'POST',
                body: colorData,
            }),
        }),
        updateColor: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body: updatedData,
            }),
        }),
        singleColor: builder.query({
            query: ({ id }) => ({
                url: `/getSingleColor/${id}`,
            }),
        }),
        deleteColor: builder.mutation({
            query: ({ id }) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetColorsQuery,
    useCreateColorMutation,
    useUpdateColorMutation,
    useSingleColorQuery,
    useDeleteColorMutation,
} = colorApi;
