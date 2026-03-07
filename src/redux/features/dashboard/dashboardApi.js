import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PROTECTED_INSTANCE_ROUTE } from '../../../utils/APIs/APIs';

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: fetchBaseQuery({
        baseUrl: PROTECTED_INSTANCE_ROUTE + 'dashboard',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.employee?.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => ({
                url: '/stats',
            }),
        }),
        getOrdersReport: builder.query({
            query: (params) => ({
                url: '/report',
                params
            }),
        }),
    }),
});

export const {
    useGetDashboardStatsQuery,
    useGetOrdersReportQuery,
} = dashboardApi;
