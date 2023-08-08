import axios from "axios"
import useAuthStore from "@/stores/AuthStore"

const authStore = useAuthStore();

// Create an Axios instance if you wish or use the default axios object
export const axiosInstance = axios.create({
    baseURL: '/api',
    // other config here
});

// Request interceptor
axiosInstance.interceptors.request.use((config:axios.InternalAxiosRequestConfig) => {
    // Get token from Pinia store
    const token = authStore.getToken();

    // If the token exists, set it in the Authorization header
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    // Handle request error
    return Promise.reject(error);
});