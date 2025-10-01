import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from "../../config/apiConfig";
import { logout } from '../slice/authSlice';
import { AppDispatch } from '../store';

export interface ApiData {
    id: string | number;
    PropUseID: any;
    PropertyUse?: any;
    data?: any;
}

export interface TblPropUseId {
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

export const tblPropUseIdApi = createApi({
    reducerPath: 'tblPropUseIdApi',
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
    tagTypes: ['TblPropUseIdData'],
    endpoints: (builder) => ({
        getTblPropUseIds: builder.query<TblPropUseId, { perPage: number; page: number; search?: string }>({
            query: ({ perPage, page, search }) => `admin/tbl-prop-use-ids?per_page=${perPage}&page=${page}&search=${search || ''}`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'TblPropUseIdData' as const, id })),
                        { type: 'TblPropUseIdData', id: 'LIST' },
                    ]
                    : [{ type: 'TblPropUseIdData', id: 'LIST' }],
        }),

        getTblPropUseIdById: builder.query<ApiData, string>({
            query: (id) => `admin/tbl-prop-use-ids/${id}`,
            providesTags: (_, __, id) => [{ type: 'TblPropUseIdData', id }],
        }),

        createTblPropUseId: builder.mutation<ApiData, Partial<ApiData>>({
            query: (newData: any) => {
                const formData = new FormData();
                Object.entries(newData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value as string | Blob);
                    }
                });

                return {
                    url: 'admin/tbl-prop-use-ids',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: [{ type: 'TblPropUseIdData', id: 'LIST' }],
        }),

        updateTblPropUseId: builder.mutation<ApiData, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `admin/tbl-prop-use-ids/${id}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_, error, { id }) => (error ? [] : [{ type: 'TblPropUseIdData', id }]),
        }),

        deleteTblPropUseId: builder.mutation<{ success: boolean; id: string }, string>({
            query: (id) => ({
                url: `admin/tbl-prop-use-ids/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: () => [{ type: 'TblPropUseIdData', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetTblPropUseIdsQuery,
    useGetTblPropUseIdByIdQuery,
    useCreateTblPropUseIdMutation,
    useUpdateTblPropUseIdMutation,
    useDeleteTblPropUseIdMutation,
} = tblPropUseIdApi;
