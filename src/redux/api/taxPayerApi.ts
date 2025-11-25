import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from "../../config/apiConfig";
import { logout } from '../slice/authSlice';
import { AppDispatch } from '../store';

export interface ApiData {
    id?: string | number;
    WardNo: string;
    sarkelNo: string;
    HoldingNo: string;
    ClientNo: string;
    StreetID: string;
    OwnersName: string;
    FHusName: string;
    BillingAddress: string;
    PropTypeID: number | null;
    PropUseID: number | null;
    TaxpayerTypeID: number | null;
    OriginalValue: number;
    CurrentValue: number;
    Active: boolean | null;
    BankNo: string | null;
    HoldingTax: number;
    WaterTax: number;
    LightingTax: number;
    ConservancyTax: number;
    Arrear: number;
    ArrStYear: number;
    ArrStYear1: number;
    ArrStPeriod: string;
    data?: any;
}



export interface TaxPayer {
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

export const taxPayerApi = createApi({
    reducerPath: 'taxPayerApi',
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
    tagTypes: ['TaxPayerData'],
    endpoints: (builder) => ({
        getTaxPayerListSelect: builder.query<TaxPayer, { perPage: number; page: number; search?: string }>({
            query: ({ perPage, page, search }) => `admin/tax-payer-list?per_page=${perPage}&page=${page}&search=${search || ''}`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'TaxPayerData' as const, id })),
                        { type: 'TaxPayerData', id: 'LIST' },
                    ]
                    : [{ type: 'TaxPayerData', id: 'LIST' }],
        }),
        getTaxPayers: builder.query<TaxPayer, { perPage: number; page: number; search?: string }>({
            query: ({ perPage, page, search }) => `admin/tax-payers?per_page=${perPage}&page=${page}&search=${search || ''}`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'TaxPayerData' as const, id })),
                        { type: 'TaxPayerData', id: 'LIST' },
                    ]
                    : [{ type: 'TaxPayerData', id: 'LIST' }],
        }),

        getTaxPayerBillById: builder.query<ApiData, string>({
            query: (id) => `bill/single-bill-show/${id}`,
            providesTags: (_, __, id) => [{ type: 'TaxPayerData', id }],
        }),

        getTaxPayerById: builder.query<ApiData, string>({
            query: (id) => `admin/tax-payers/${id}`,
            providesTags: (_, __, id) => [{ type: 'TaxPayerData', id }],
        }),
        getTaxPayerClientById: builder.query<ApiData, string>({
            query: (id) => `admin/tax-payers/client-no/${id}`,
            providesTags: (_, __, id) => [{ type: 'TaxPayerData', id }],
        }),

        createTaxPayer: builder.mutation<ApiData, Partial<ApiData>>({
            query: (newData: any) => {
                const formData = new FormData();
                Object.entries(newData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value as string | Blob);
                    }
                });

                return {
                    url: 'admin/tax-payers',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: [{ type: 'TaxPayerData', id: 'LIST' }],
        }),

        updateTaxPayer: builder.mutation<ApiData, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `admin/tax-payers/${id}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_, error, { id }) => (error ? [] : [{ type: 'TaxPayerData', id }]),
        }),

        deleteTaxPayer: builder.mutation<{ success: boolean; id: string }, string>({
            query: (id) => ({
                url: `admin/tax-payers/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: () => [{ type: 'TaxPayerData', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetTaxPayerListSelectQuery,
    useGetTaxPayersQuery,
    useLazyGetTaxPayerBillByIdQuery,
    useGetTaxPayerByIdQuery,
    useLazyGetTaxPayerClientByIdQuery,
    useLazyGetTaxPayerByIdQuery,
    useCreateTaxPayerMutation,
    useUpdateTaxPayerMutation,
    useDeleteTaxPayerMutation,
} = taxPayerApi;
