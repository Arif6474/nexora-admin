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
    tagTypes: ['Orders', 'Order', 'OrderCount'],
    endpoints: (builder) => ({
        // Fetch a single order by ID
        getSingleOrder: builder.query({
            query: ({ id }) => ({
                url: `/${id}`,
            }),
            providesTags: (result, error, { id }) => [{ type: 'Order', id }],
        }),
        getOrders: builder.query({
            query: ({ search = '', filter, queryParams }) => ({
                url: '/',
                params: {
                    search,
                    filter,
                    currentPage: queryParams?.currentPage,
                    limit: queryParams?.limit,
                    orderStatus: queryParams?.orderStatus,
                    customerId: queryParams?.customerId,
                },
            }),
            providesTags: ['Orders'],
        }),
        updateOrderStatusById: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body: updatedData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Order', id },
                'Orders',
                'OrderCount',
            ],
        }),
        getOrderCountByStatus: builder.query({
            query: () => ({
                url: '/count/status',
            }),
            providesTags: ['OrderCount'],
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useGetSingleOrderQuery,
    useUpdateOrderStatusByIdMutation,
    useGetOrderCountByStatusQuery,
} = orderApi;