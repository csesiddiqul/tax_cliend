import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

// Define a custom error type to include response property
interface AxiosError {
    response?: {
        data: {
            message: string;
        };
    };
}

// Thunk for logging in the user
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData: any, { rejectWithValue }) => {
        try {
            const response = await API.post('/login', userData);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                return rejectWithValue(axiosError.response.data);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


export const loginClient = createAsyncThunk(
    'auth/loginClient',
    async (userData: any, { rejectWithValue }) => {
        try {
            const response = await API.post('/client/login', userData);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                return rejectWithValue(axiosError.response.data);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);



interface AuthState {
    token: string | null;
    user: any;
    roles: string[];
    permissions: string[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Initial state
const initialState: AuthState = {
    token: localStorage.getItem('token') || null,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
    roles: localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles') as string) : [],
    permissions: localStorage.getItem('permissions') ? JSON.parse(localStorage.getItem('permissions') as string) : [],
    status: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            state.user = null;
            state.roles = [];
            state.permissions = [];
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('roles');
            localStorage.removeItem('permissions');
        },
        setUser(state, action) {
            state.user = action.payload;
            state.roles = action.payload.roles || [];
            state.permissions = action.payload.permissions || [];
            localStorage.setItem('user', JSON.stringify(action.payload));
            localStorage.setItem('roles', JSON.stringify(action.payload.roles || []));
            localStorage.setItem('permissions', JSON.stringify(action.payload.permissions || []));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const { data } = action.payload;
                state.status = 'succeeded';
                state.token = data.token;
                state.user = data;
                state.roles = data.roles || [];
                state.permissions = data.permissions || [];
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                localStorage.setItem('roles', JSON.stringify(data.roles || []));
                localStorage.setItem('permissions', JSON.stringify(data.permissions || []));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string | null;
            })
            .addCase(loginClient.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginClient.fulfilled, (state, action) => {
                const { data } = action.payload;
                state.status = 'succeeded';
                state.token = data.token;
                state.user = data;
                state.roles = data.roles || ['client'];
                state.permissions = data.permissions || [];
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                localStorage.setItem('roles', JSON.stringify(data.roles || ['client']));
                localStorage.setItem('permissions', JSON.stringify(data.permissions || []));
            })
            .addCase(loginClient.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string | null;
            });
    },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
