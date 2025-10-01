import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from "../../config/apiConfig";
import { logout } from '../slice/authSlice';
import { AppDispatch } from '../store';

export interface ApiData {
    id: string | number;
    TaxpayerTypeID: any;
    TaxpayerType?: any;
    data?: any;
}

export interface TaxPayerType {
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

export const taxPayerTypeApi = createApi({
    reducerPath: 'taxPayerTypeApi',
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
    tagTypes: ['TaxPayerTypeData'],
    endpoints: (builder) => ({
        getTaxPayerTypes: builder.query<TaxPayerType, { perPage: number; page: number; search?: string }>({
            query: ({ perPage, page, search }) => `admin/tax-payer-types?per_page=${perPage}&page=${page}&search=${search || ''}`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'TaxPayerTypeData' as const, id })),
                        { type: 'TaxPayerTypeData', id: 'LIST' },
                    ]
                    : [{ type: 'TaxPayerTypeData', id: 'LIST' }],
        }),

        getTaxPayerTypeById: builder.query<ApiData, string>({
            query: (id) => `admin/tax-payer-types/${id}`,
            providesTags: (_, __, id) => [{ type: 'TaxPayerTypeData', id }],
        }),

        createTaxPayerType: builder.mutation<ApiData, Partial<ApiData>>({
            query: (newData: any) => {
                const formData = new FormData();
                Object.entries(newData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value as string | Blob);
                    }
                });

                return {
                    url: 'admin/tax-payer-types',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: [{ type: 'TaxPayerTypeData', id: 'LIST' }],
        }),

        updateTaxPayerType: builder.mutation<ApiData, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `admin/tax-payer-types/${id}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_, error, { id }) => (error ? [] : [{ type: 'TaxPayerTypeData', id }]),
        }),

        deleteTaxPayerType: builder.mutation<{ success: boolean; id: string }, string>({
            query: (id) => ({
                url: `admin/tax-payer-types/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: () => [{ type: 'TaxPayerTypeData', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetTaxPayerTypesQuery,
    useGetTaxPayerTypeByIdQuery,
    useCreateTaxPayerTypeMutation,
    useUpdateTaxPayerTypeMutation,
    useDeleteTaxPayerTypeMutation,
} = taxPayerTypeApi;
