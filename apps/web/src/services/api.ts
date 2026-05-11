import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useUserStore } from '../store/userStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useUserStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - logout and redirect to login
      useUserStore.getState().logout();
      window.location.href = '/login';
    }

    const errorMessage =
      (error.response?.data as any)?.error?.message || error.message || 'Something went wrong';

    return Promise.reject(new Error(errorMessage));
  }
);
