import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from "../../config/apiConfig";
import { logout } from '../slice/authSlice';
import { AppDispatch } from '../store';

export interface ApiData {
    id: string | number;
    StreetID: any;
    StreetName?: any;
    data?: any;
}

export interface ApiDataResponse {
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

export const streetsApi = createApi({
    reducerPath: 'streetApi',
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
    tagTypes: ['StreetData'],
    endpoints: (builder) => ({

        exportExcel: builder.mutation<Blob, { search?: string }>({
            query: ({ search }) => ({
                url: `admin/street/export?search=${search || ''}`,
                method: 'GET',
                responseHandler: async (response: any) => await response.blob(),
            }),
        }),


        getStreets: builder.query<ApiDataResponse, { perPage: number; page: number; search?: string }>({
            query: ({ perPage, page, search }) => `admin/streets?per_page=${perPage}&page=${page}&search=${search || ''}`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'StreetData' as const, id })),
                        { type: 'StreetData', id: 'LIST' },
                    ]
                    : [{ type: 'StreetData', id: 'LIST' }],
        }),

        getStreetById: builder.query<ApiData, string>({
            query: (id) => `admin/streets/${id}`,
            providesTags: (_, __, id) => [{ type: 'StreetData', id }],
        }),

        createStreet: builder.mutation<ApiData, Partial<ApiData>>({
            query: (newData) => {
                const formData = new FormData();
                Object.entries(newData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value as string | Blob);
                    }
                });

                return {
                    url: 'admin/streets',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: [{ type: 'StreetData', id: 'LIST' }],
        }),

        updateStreet: builder.mutation<ApiData, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `admin/streets/${id}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_, error, { id }) => (error ? [] : [{ type: 'StreetData', id }]),
        }),

        deleteStreet: builder.mutation<{ success: boolean; id: string }, string>({
            query: (id) => ({
                url: `admin/streets/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: () => [{ type: 'StreetData', id: 'LIST' }],
        }),
    }),
});

export const {
    useExportExcelMutation,
    useGetStreetsQuery,
    useGetStreetByIdQuery,
    useCreateStreetMutation,
    useUpdateStreetMutation,
    useDeleteStreetMutation,
} = streetsApi;
