import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from "../../config/apiConfig";
import { logout } from '../slice/authSlice';
import { AppDispatch } from '../store';

export interface ApiData {
    id: string | number;
    // BankNo: any;
    // BankName?: any;
    // Branch?: any;
    // AccountsNo?: any;
    data?: any;
    ClientNo?: any;
    code?: any;
    message?: any
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

export const rtkAuthApi = createApi({
    reducerPath: 'rtkAuthApi',
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
            // const dispatch = api.dispatch as AppDispatch;
            // dispatch(logout());
            // localStorage.removeItem('token');
            // window.location.href = '/auth/sign-in';
        }

        return result;
    },
    tagTypes: ['RtkAuthData'],
    endpoints: (builder) => ({


        getTaxPayerInfo: builder.query<ApiData, void>({
            query: () => `tax-payer-info`,
            providesTags: ['RtkAuthData'],
        }),

        resendVerifyPhone: builder.mutation<ApiData, Partial<ApiData>>({
            query: (newData: any) => {
                const formData = new FormData();
                Object.entries(newData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value as string | Blob);
                    }
                });

                return {
                    url: 'client/resend-verify-phone',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: [{ type: 'RtkAuthData', id: 'LIST' }],
        }),

        otpVerifyPhone: builder.mutation<ApiData, Partial<ApiData>>({
            query: (newData: any) => {
                const formData = new FormData();
                Object.entries(newData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value as string | Blob);
                    }
                });

                return {
                    url: 'client/verify-phone',
                    method: 'POST',
                    body: formData,
                };
            },

            invalidatesTags: [{ type: 'RtkAuthData', id: 'LIST' }],
        }),

    }),
});

export const {
    useGetTaxPayerInfoQuery,
    useLazyGetTaxPayerInfoQuery,
    useResendVerifyPhoneMutation,
    useOtpVerifyPhoneMutation
} = rtkAuthApi;
