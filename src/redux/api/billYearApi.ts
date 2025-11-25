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
    Year?: any;
    Year1?: any;
    Period_of_bill?: any;

}

export interface BillYear {
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

export const billYearApi = createApi({
    reducerPath: 'billYearApi',
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
    tagTypes: ['BillYearData'],
    endpoints: (builder) => ({
        getBillYears: builder.query<BillYear, { perPage: number; page: number; search?: string }>({
            query: ({ perPage, page, search }) => `bill/year?per_page=${perPage}&page=${page}&search=${search || ''}`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'BillYearData' as const, id })),
                        { type: 'BillYearData', id: 'LIST' },
                    ]
                    : [{ type: 'BillYearData', id: 'LIST' }],
        }),

        getBillYearById: builder.query<ApiData, string>({
            query: (id) => `bill/year/${id}`,
            providesTags: (_, __, id) => [{ type: 'BillYearData', id }],
        }),


        getBillYear: builder.query<ApiData, void>({
            query: () => `bill/year`,
            providesTags: ['BillYearData'],
        }),


        createBillYear: builder.mutation<ApiData, Partial<ApiData>>({
            query: (newData: any) => {
                const formData = new FormData();
                Object.entries(newData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value as string | Blob);
                    }
                });

                return {
                    url: 'bill/year',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: [{ type: 'BillYearData', id: 'LIST' }],
        }),

        updateBillYear: builder.mutation<ApiData, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `bill/year/${id}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_, error, { id }) => (error ? [] : [{ type: 'BillYearData', id }]),
        }),

        deleteBillYear: builder.mutation<{ success: boolean; id: string }, string>({
            query: (id) => ({
                url: `bill/year/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: () => [{ type: 'BillYearData', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetBillYearsQuery,
    useGetBillYearQuery,
    useGetBillYearByIdQuery,
    useLazyGetBillYearByIdQuery,
    useCreateBillYearMutation,
    useUpdateBillYearMutation,
    useDeleteBillYearMutation,
} = billYearApi;
