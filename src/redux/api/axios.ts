import axios from 'axios';
import { API_BASE_URL } from "../../config/apiConfig";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    // Laravel Sanctum হলে লাগবে:
    withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // যদি JWT token use করেন
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor
api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error?.response?.status === 401) {
            localStorage.clear();
            window.location.href = "/auth/sign-in";
        }
        return Promise.reject(error);
    }
);

export default api;
