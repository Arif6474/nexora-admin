import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CUSTOMER_API } from '../../../utils/APIs/APIs';

export const customerApi = createApi({
    reducerPath: 'customerApi',
    baseQuery: fetchBaseQuery({
        baseUrl: CUSTOMER_API,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.employee?.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({
        getCustomers: builder.query({
            query: ({ search = '', filter, queryParams }) => ({
                url: '/getCustomerWithQuery',
                params: {
                    search,
                    filter,
                    currentPage: queryParams?.currentPage,
                    limit: queryParams?.limit,
                },
            }),
        }),
        singleCustomer: builder.query({
            query: ({ id }) => ({
                url: `/getSingleCustomer/${id}`,
            }),
        }),
        updateCustomer: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body: updatedData,
            }),
        }),
        archiveCustomer: builder.mutation({
            query: ({ id }) => ({
                url: `/archiveCustomer/${id}`,
                method: 'PATCH',
            }),
        }),
        deleteCustomer: builder.mutation({
            query: ({ id }) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetCustomersQuery,
    useSingleCustomerQuery,
    useUpdateCustomerMutation,
    useArchiveCustomerMutation,
    useDeleteCustomerMutation,
} = customerApi;
