import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

export const API_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config) => {
    const user = sessionStorage.getItem('user');
    const token = user ? JSON.parse(user)?.token : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      enqueueSnackbar(`Error, ${error.code}}`, { variant: 'error' });
    }
    console.log(error.response);
    enqueueSnackbar('Request error: ' + error.message, { variant: 'error' });
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error.response);
    if (error.response.status === 401) {
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    if (error.response) {
      enqueueSnackbar(error.response.data.msg || error.response.data.message || error.message, { variant: 'error' });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
