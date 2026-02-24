import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BRAND_API } from '../../../utils/APIs/APIs';

export const brandApi = createApi({
    reducerPath: 'brandApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BRAND_API,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.employee?.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({
        getBrands: builder.query({
            query: ({ search = '', filter, queryParams }) => ({
                url: '/getBrandWithQuery',
                params: {
                    search, filter,
                    currentPage: queryParams?.currentPage,
                    limit: queryParams?.limit,
                },
            }),
        }),
        createBrand: builder.mutation({
            query: (brandData) => ({
                url: '/',
                method: 'POST',
                body: brandData,
            }),
        }),
        updateBrand: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body: updatedData,
            }),
        }),
        singleBrand: builder.query({
            query: ({ id }) => ({
                url: `/getSingleBrand/${id}`,
            }),
        }),
        deleteBrand: builder.mutation({
            query: ({ id }) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetBrandsQuery,
    useCreateBrandMutation,
    useUpdateBrandMutation,
    useSingleBrandQuery,
    useDeleteBrandMutation,
} = brandApi;
