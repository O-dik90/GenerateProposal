import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

export const API_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true, // Important for cookies
});

// Request Interceptor
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
      if (error.response.data?.msg === 'Invalid credentials' && window.location.pathname === '/login') {
        enqueueSnackbar('Email/kata sandi tidak cocok', { variant: 'error' });
      } else {
        try {
          console.log('🔄 Attempting token refresh...');
          const res = await axiosInstance.get('/refresh-token');

          if (res.data?.newToken) {
            console.log('✅ Token refreshed successfully!');
            sessionStorage.setItem('user', JSON.stringify({ token: res.data.newToken }));

            // Retry the original request with the new token
            error.config.headers.Authorization = `Bearer ${res.data.newToken}`;
            return axiosInstance(error.config);
          }
        } catch (refreshError) {
          console.error('🔴 Token refresh failed:', refreshError);
          enqueueSnackbar('Session expired, please log in again.', { variant: 'warning' });

          // Clear user session and redirect to login
          sessionStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    } else if (error.response?.status === 404) {
      enqueueSnackbar('User tidak ditemukan', { variant: 'error' });
    } else {
      enqueueSnackbar(error.message, { variant: 'error' });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
