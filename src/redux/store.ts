import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import { streetsApi } from './api/streetsApi';
import { bankAccountApi } from './api/bankAccountApi';
import { tblPropTypeApi } from './api/tblPropTypeApi';
import { tblPropUseIdApi } from './api/tblPropUseIdApi';
import { crudsApi } from './api/crudsApi';
import { taxPayerTypeApi } from './api/taxPayerTypeApi';
import { taxRatesApi } from './api/taxRatesApi';
import { taxPayerApi } from './api/taxPayerApi';
const store = configureStore({
    reducer: {
        auth: authReducer,
        [streetsApi.reducerPath]: streetsApi.reducer,
        [bankAccountApi.reducerPath]: bankAccountApi.reducer,
        [tblPropTypeApi.reducerPath]: tblPropTypeApi.reducer,
        [tblPropUseIdApi.reducerPath]: tblPropUseIdApi.reducer,
        [crudsApi.reducerPath]: crudsApi.reducer,
        [taxPayerTypeApi.reducerPath]: taxPayerTypeApi.reducer,
        [taxRatesApi.reducerPath]: taxRatesApi.reducer,
        [taxPayerApi.reducerPath]: taxPayerApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(streetsApi.middleware)
            .concat(bankAccountApi.middleware)
            .concat(tblPropTypeApi.middleware)
            .concat(tblPropUseIdApi.middleware)
            .concat(taxPayerTypeApi.middleware)
            .concat(taxRatesApi.middleware)
            .concat(taxPayerApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
