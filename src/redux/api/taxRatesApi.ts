import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from "../../config/apiConfig";
import { logout } from '../slice/authSlice';
import { AppDispatch } from '../store';

export interface ApiData {
    id: string | number;
    Id: any;
    HoldingT: any;
    ConservancyT?: any;
    WaterT?: any;
    LightT?: any;
    TotT?: any;
    data?: any;
}

export interface TaxRate {
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

export const taxRatesApi = createApi({
    reducerPath: 'taxRatesApi',
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
    tagTypes: ['TaxRateData'],
    endpoints: (builder) => ({
        getTaxRates: builder.query<TaxRate, { perPage: number; page: number; search?: string }>({
            query: ({ perPage, page, search }) => `admin/tax-rates?per_page=${perPage}&page=${page}&search=${search || ''}`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'TaxRateData' as const, id })),
                        { type: 'TaxRateData', id: 'LIST' },
                    ]
                    : [{ type: 'TaxRateData', id: 'LIST' }],
        }),

        getTaxRateById: builder.query<ApiData, string>({
            query: (id) => `admin/tax-rates/${id}`,
            providesTags: (_, __, id) => [{ type: 'TaxRateData', id }],
        }),

        createTaxRate: builder.mutation<ApiData, Partial<ApiData>>({
            query: (newData: any) => {
                const formData = new FormData();
                Object.entries(newData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value as string | Blob);
                    }
                });

                return {
                    url: 'admin/tax-rates',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: [{ type: 'TaxRateData', id: 'LIST' }],
        }),

        updateTaxRate: builder.mutation<ApiData, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `admin/tax-rates/${id}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_, error, { id }) => (error ? [] : [{ type: 'TaxRateData', id }]),
        }),

        deleteTaxRate: builder.mutation<{ success: boolean; id: string }, string>({
            query: (id) => ({
                url: `admin/tax-rates/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: () => [{ type: 'TaxRateData', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetTaxRatesQuery,
    useGetTaxRateByIdQuery,
    useLazyGetTaxRateByIdQuery,
    useCreateTaxRateMutation,
    useUpdateTaxRateMutation,
    useDeleteTaxRateMutation,
} = taxRatesApi;
