import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PRODUCT_IMAGE_API } from '../../../utils/APIs/APIs';

export const productImageApi = createApi({
    reducerPath: 'productImageApi',
    baseQuery: fetchBaseQuery({
        baseUrl: PRODUCT_IMAGE_API,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.employee?.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({
        // Fetch all product images
        getAllProductImages: builder.query({
            query: ({ search = '', filter, queryParams }) => ({
                url: '/getProductImageWithQuery',
                params: {
                    search, filter,
                    currentPage: queryParams.currentPage,
                    limit: queryParams.limit,
                    product: queryParams.product,
                },
            }),
        }),

        // Create a new product image
        createProductImage: builder.mutation({
            query: (productImageData) => ({
                url: '/',
                method: 'POST',
                body: productImageData,
            }),
        }),

        // Update an existing product image
        updateProductImage: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body: updatedData,
            }),
        }),

        // Fetch a single product image by ID
        getSingleProductImage: builder.query({
            query: ({ id }) => ({
                url: `/getSingleProductImage/${id}`,
            }),
        }),

        // Delete an product image
        deleteProductImage: builder.mutation({
            query: ({ id }) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
        }),

        // Archive an product image
        archiveProductImage: builder.mutation({
            query: ({ id, isActive }) => ({
                url: `/archiveProductImage/${id}`,
                method: 'PATCH',
                body: { isActive }
            }),
        }),
    }),
});

export const {
    useGetAllProductImagesQuery,
    useCreateProductImageMutation,
    useUpdateProductImageMutation,
    useGetSingleProductImageQuery,
    useDeleteProductImageMutation,
    useArchiveProductImageMutation,
} = productImageApi;
