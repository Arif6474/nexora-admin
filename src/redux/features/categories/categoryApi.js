import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CATEGORY_API } from '../../../utils/APIs/APIs'; // Your category API route

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: CATEGORY_API,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.employee?.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({
        getCategories: builder.query({
            query: ({ search = '', filter, queryParams }) => ({
                url: '/getCategoryWithQuery',
                params: {
                    search, filter,
                    currentPage: queryParams.currentPage,
                    limit: queryParams.limit,
                },
            }),
        }),
        createCategory: builder.mutation({
            query: (categoryData) => ({
                url: '/',
                method: 'POST',
                body: categoryData,
            }),
        }),
        updateCategory: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body: updatedData,
            }),
        }),
        singleCategory: builder.query({
            query: ({ id }) => ({
                url: `/getSingleCategory/${id}`,
            }),
        }),
        deleteCategory: builder.mutation({
            query: ({ id }) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useSingleCategoryQuery,
    useDeleteCategoryMutation,
} = categoryApi;
