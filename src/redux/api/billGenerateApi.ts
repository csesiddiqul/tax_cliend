import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from "../../config/apiConfig";
import { logout } from '../slice/authSlice';
import { AppDispatch } from '../store';

export interface ApiData {
    id?: string | number;
    data?: any;
}



export interface BillGenerate {
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

export const billGenerateApi = createApi({
    reducerPath: 'billGenerateApi',
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
    tagTypes: ['BillGenerateData'],
    endpoints: (builder) => ({

        generalBillGenerate: builder.mutation<ApiData, Partial<ApiData>>({
            query: (newData: any) => {
                const formData = new FormData();
                Object.entries(newData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value as string | Blob);
                    }
                });

                return {
                    url: 'bill/general',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: [{ type: 'BillGenerateData', id: 'LIST' }],
        }),

        govtBillGenerate: builder.mutation<ApiData, Partial<ApiData>>({
            query: (newData: any) => {
                const formData = new FormData();
                Object.entries(newData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value as string | Blob);
                    }
                });

                return {
                    url: 'bill/govt',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: [{ type: 'BillGenerateData', id: 'LIST' }],
        }),
        singleBillGenerate: builder.mutation<ApiData, Partial<ApiData>>({
            query: (newData: any) => {
                const formData = new FormData();
                Object.entries(newData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value as string | Blob);
                    }
                });

                return {
                    url: 'bill/single',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: [{ type: 'BillGenerateData', id: 'LIST' }],
        }),

    }),
});

export const {
    useGeneralBillGenerateMutation,
    useGovtBillGenerateMutation,
    useSingleBillGenerateMutation,
} = billGenerateApi;
