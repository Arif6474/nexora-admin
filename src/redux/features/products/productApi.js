import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PRODUCT_API } from '../../../utils/APIs/APIs';

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({
        baseUrl: PRODUCT_API,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.employee?.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ search = '', filter, queryParams }) => ({
                url: '/getProductWithQuery',
                params: {
                    search, filter,
                    currentPage: queryParams.currentPage,
                    limit: queryParams.limit,
                    category: queryParams.category,
                },
            }),
        }),
        createProduct: builder.mutation({
            query: (productData) => ({
                url: '/',
                method: 'POST',
                body: productData,
            }),
        }),
        updateProduct: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body: updatedData,
            }),
        }),
        singleProduct: builder.query({
            query: ({ id }) => ({
                url: `/getSingleProduct/${id}`,
            }),
        }),
        deleteProduct: builder.mutation({
            query: ({ id }) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
        }),
        archiveProduct: builder.mutation({
            query: ({ id }) => ({
                url: `/archiveProduct/${id}`,
                method: 'PATCH',
            }),
        }),
    }),
});

export const {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useSingleProductQuery,
    useDeleteProductMutation,
    useArchiveProductMutation,
} = productApi;
