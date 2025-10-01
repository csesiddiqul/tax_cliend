import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from "../../config/apiConfig";
import { logout } from '../slice/authSlice';
import { AppDispatch } from '../store';

export interface ApiData {
    id: string | number;
    BankNo: any;
    BankName?: any;
    Branch?: any;
    AccountsNo?: any;
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

export const bankAccountApi = createApi({
    reducerPath: 'bankAccountApi',
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
    tagTypes: ['BankAccountData'],
    endpoints: (builder) => ({
        getBankAccounts: builder.query<ApiDataResponse, { perPage: number; page: number; search?: string }>({
            query: ({ perPage, page, search }) => `admin/bank-accounts?per_page=${perPage}&page=${page}&search=${search || ''}`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'BankAccountData' as const, id })),
                        { type: 'BankAccountData', id: 'LIST' },
                    ]
                    : [{ type: 'BankAccountData', id: 'LIST' }],
        }),

        getBankAccountById: builder.query<ApiData, string>({
            query: (id) => `admin/bank-accounts/${id}`,
            providesTags: (_, __, id) => [{ type: 'BankAccountData', id }],
        }),

        createBankAccount: builder.mutation<ApiData, Partial<ApiData>>({
            query: (newData: any) => {
                const formData = new FormData();
                Object.entries(newData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value as string | Blob);
                    }
                });

                return {
                    url: 'admin/bank-accounts',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: [{ type: 'BankAccountData', id: 'LIST' }],
        }),

        updateBankAccount: builder.mutation<ApiData, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `admin/bank-accounts/${id}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_, error, { id }) => (error ? [] : [{ type: 'BankAccountData', id }]),
        }),

        deleteBankAccount: builder.mutation<{ success: boolean; id: string }, string>({
            query: (id) => ({
                url: `admin/bank-accounts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: () => [{ type: 'BankAccountData', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetBankAccountsQuery,
    useGetBankAccountByIdQuery,
    useCreateBankAccountMutation,
    useUpdateBankAccountMutation,
    useDeleteBankAccountMutation,
} = bankAccountApi;
