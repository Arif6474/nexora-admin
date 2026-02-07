import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SIZE_API } from '../../../utils/APIs/APIs';

export const sizeApi = createApi({
    reducerPath: 'sizeApi',
    baseQuery: fetchBaseQuery({
        baseUrl: SIZE_API,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.employee?.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({
        getSizes: builder.query({
            query: ({ search = '', filter, queryParams }) => ({
                url: '/getSizeWithQuery',
                params: {
                    search, filter,
                    currentPage: queryParams?.currentPage || 1,
                    limit: queryParams?.limit || 10,
                },
            }),
        }),
        createSize: builder.mutation({
            query: (sizeData) => ({
                url: '/',
                method: 'POST',
                body: sizeData,
            }),
        }),
        updateSize: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body: updatedData,
            }),
        }),
        singleSize: builder.query({
            query: ({ id }) => ({
                url: `/getSingleSize/${id}`,
            }),
        }),
        deleteSize: builder.mutation({
            query: ({ id }) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetSizesQuery,
    useCreateSizeMutation,
    useUpdateSizeMutation,
    useSingleSizeQuery,
    useDeleteSizeMutation,
} = sizeApi;
