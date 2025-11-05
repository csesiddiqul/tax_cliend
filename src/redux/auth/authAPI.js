import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API methods
export const loginUser = (userData) => {
    return api.post('/login', userData);
};

export const loginClient = (userData) => {
    return api.post('/client/login', userData);
};

export const registerUser = (userData) => {
    return api.post('/register', userData);
};

export const refreshToken = () => {
    return api.post('/refresh-token');
};

export default api;