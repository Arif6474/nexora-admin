import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PRODUCT_COLOR_API } from '../../../utils/APIs/APIs';

export const productColorApi = createApi({
    reducerPath: 'productColorApi',
    baseQuery: fetchBaseQuery({
        baseUrl: PRODUCT_COLOR_API,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.employee?.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({
        getProductColors: builder.query({
            query: ({ search = '', filter, queryParams }) => ({
                url: '/getProductColorWithQuery',
                params: {
                    search, filter,
                    currentPage: queryParams.currentPage,
                    limit: queryParams.limit,
                    product: queryParams.product,
                },
            }),
        }),
        createProductColor: builder.mutation({
            query: (productColorData) => ({
                url: '/',
                method: 'POST',
                body: productColorData,
            }),
        }),
        updateProductColor: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body: updatedData,
            }),
        }),
        singleProductColor: builder.query({
            query: ({ id }) => ({
                url: `/getSingleProductColor/${id}`,
            }),
        }),
        deleteProductColor: builder.mutation({
            query: ({ id }) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetProductColorsQuery,
    useCreateProductColorMutation,
    useUpdateProductColorMutation,
    useSingleProductColorQuery,
    useDeleteProductColorMutation,
} = productColorApi;
