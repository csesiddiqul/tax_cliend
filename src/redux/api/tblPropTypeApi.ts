import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from "../../config/apiConfig";
import { logout } from '../slice/authSlice';
import { AppDispatch } from '../store';

export interface ApiData {
    id: string | number;
    PropTypeID: any;
    PropertyType?: any;
    data?: any;
}

export interface TblPropType {
    data: ApiData[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export const tblPropTypeApi = createApi({
    reducerPath: 'tblPropTypeApi',
    baseQuery: async (args, api, extraOptions) => {
        const baseQuery = fetchBaseQuery({
            baseUrl: API_BASE_URL,
            prepareHeaders: (headers) => {
                const token = localStorage.getItem('token');
                if (token) {
                    headers.set('Authorization', `Bearer ${token}`);
                }
                headers.set('Accept', `application/json`);
                return headers;
            },
            credentials: 'include',
        });

        const result = await baseQuery(args, api, extraOptions);

        if (result.error?.status === 401) {
            const dispatch = api.dispatch as AppDispatch;
            dispatch(logout());
            localStorage.removeItem('token');
            window.location.href = '/auth/sign-in';
        }

        return result;
    },
    tagTypes: ['TblPropTypeData'],
    endpoints: (builder) => ({
        getTblPropTypes: builder.query<TblPropType, { perPage: number; page: number; search?: string }>({
            query: ({ perPage, page, search }) => `admin/tbl-prop-types?per_page=${perPage}&page=${page}&search=${search || ''}`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'TblPropTypeData' as const, id })),
                        { type: 'TblPropTypeData', id: 'LIST' },
                    ]
                    : [{ type: 'TblPropTypeData', id: 'LIST' }],
        }),

        getTblPropTypeById: builder.query<ApiData, string>({
            query: (id) => `admin/tbl-prop-types/${id}`,
            providesTags: (_, __, id) => [{ type: 'TblPropTypeData', id }],
        }),

        createTblPropType: builder.mutation<ApiData, Partial<ApiData>>({
            query: (newData: any) => {
                const formData = new FormData();
                Object.entries(newData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value as string | Blob);
                    }
                });

                return {
                    url: 'admin/tbl-prop-types',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: [{ type: 'TblPropTypeData', id: 'LIST' }],
        }),

        updateTblPropType: builder.mutation<ApiData, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `admin/tbl-prop-types/${id}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_, error, { id }) => (error ? [] : [{ type: 'TblPropTypeData', id }]),
        }),

        deleteTblPropType: builder.mutation<{ success: boolean; id: string }, string>({
            query: (id) => ({
                url: `admin/tbl-prop-types/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: () => [{ type: 'TblPropTypeData', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetTblPropTypesQuery,
    useGetTblPropTypeByIdQuery,
    useCreateTblPropTypeMutation,
    useUpdateTblPropTypeMutation,
    useDeleteTblPropTypeMutation,
} = tblPropTypeApi;
