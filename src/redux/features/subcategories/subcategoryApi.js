import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SUBCATEGORY_API } from '../../../utils/APIs/APIs';

export const subcategoryApi = createApi({
    reducerPath: 'subcategoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: SUBCATEGORY_API,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.employee?.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({
        getSubcategories: builder.query({
            query: ({ search = '', filter, queryParams }) => ({
                url: '/getSubcategoryWithQuery',
                params: {
                    search, filter,
                    currentPage: queryParams.currentPage,
                    limit: queryParams.limit,
                    category: queryParams.category
                },
            }),
        }),
        createSubcategory: builder.mutation({
            query: (subcategoryData) => ({
                url: '/',
                method: 'POST',
                body: subcategoryData,
            }),
        }),
        updateSubcategory: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body: updatedData,
            }),
        }),
        singleSubcategory: builder.query({
            query: ({ id }) => ({
                url: `/getSingleSubcategory/${id}`,
            }),
        }),
        deleteSubcategory: builder.mutation({
            query: ({ id }) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetSubcategoriesQuery,
    useCreateSubcategoryMutation,
    useUpdateSubcategoryMutation,
    useSingleSubcategoryQuery,
    useDeleteSubcategoryMutation,
} = subcategoryApi;
