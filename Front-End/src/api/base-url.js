import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

export const API_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const user = sessionStorage.getItem('user');
      const token = user ? JSON.parse(user)?.token : null;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error parsing user token:', error);
    }

    return config;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      enqueueSnackbar(`Request Timeout: ${error.code}`, { variant: 'error' });
    } else {
      enqueueSnackbar('Request error: ' + error.message, { variant: 'error' });
    }
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (error.response.data?.msg === 'Invalid credentials' && window.location.pathname === '/') {
        enqueueSnackbar('Email/kata sandi tidak cocok', { variant: 'error' });
      }
      sessionStorage.removeItem('user');
    } else if (error.response?.status === 404) {
      enqueueSnackbar('User tidak ditemukan', { variant: 'error' });
    } else if (error.response?.status === 409) {
      enqueueSnackbar('Gagal Daftar, email sudah terdaftar', { variant: 'warning' });
    } else if (error.response?.status === 500) {
      enqueueSnackbar(error.response.data?.msg, { variant: 'error' });
    } else {
      enqueueSnackbar(error.message, { variant: 'error' });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
