import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PRODUCT_SIZE_API } from '../../../utils/APIs/APIs';

export const productSizeApi = createApi({
  reducerPath: 'productSizeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: PRODUCT_SIZE_API,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.employee?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // Fetch all product sizes
    getAllProductSizes: builder.query({
      query: ({ search = '', filter, queryParams }) => ({
        url: '/getProductSizeWithQuery',
        params: {
          search, filter,
          currentPage: queryParams.currentPage,
          limit: queryParams.limit,
          product: queryParams.product,
        },
      }),
    }),

    // Create a new product size
    createProductSize: builder.mutation({
      query: (productSizeData) => ({
        url: '/',
        method: 'POST',
        body: productSizeData,
      }),
    }),

    // Update an existing product size
    updateProductSize: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: updatedData,
      }),
    }),

    // Fetch a single product size by ID
    getSingleProductSize: builder.query({
      query: ({ id }) => ({
        url: `/getSingleProductSize/${id}`,
      }),
    }),

    // Delete an product size
    deleteProductSize: builder.mutation({
      query: ({ id }) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),

    // Archive an product size
    archiveProductSize: builder.mutation({
      query: ({ id }) => ({
        url: `/archiveProductSize/${id}`,
        method: 'PATCH',
      }),
    }),
  }),
});

export const {
  useGetAllProductSizesQuery,
  useCreateProductSizeMutation,
  useUpdateProductSizeMutation,
  useGetSingleProductSizeQuery,
  useDeleteProductSizeMutation,
  useArchiveProductSizeMutation,
} = productSizeApi;
