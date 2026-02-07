import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ORDERS_API } from '../../../utils/APIs/APIs';

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: fetchBaseQuery({
        baseUrl: ORDERS_API,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.employee?.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({


        // Fetch a single order by ID
        getSingleOrder: builder.query({
            query: ({ id }) => ({
                url: `/${id}`,
            }),
        }),
        getOrders: builder.query({
            query: ({ search = '', filter, queryParams }) => ({
                url: '/',
                params: {
                    search, filter,
                    currentPage: queryParams.currentPage,
                    limit: queryParams.limit,
                    orderStatus: queryParams.orderStatus,
                },
            }),
        }),
        updateOrderStatusById: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body: updatedData,
            }),
        }),
    }),
});
export const {
    useGetOrdersQuery,
    useGetSingleOrderQuery,
    useUpdateOrderStatusByIdMutation,
} = orderApi;