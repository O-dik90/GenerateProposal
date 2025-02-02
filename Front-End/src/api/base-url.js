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
    return config;
  },
  (error) => {
    enqueueSnackbar('Request error: ' + error.message, { variant: 'error' });
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      enqueueSnackbar(error.response.data.msg || error.response.data.message || error.message, { variant: 'error' });
    } else if (error.request) {
      enqueueSnackbar('No response received: ' + error.message, { variant: 'error' });
    } else {
      enqueueSnackbar('Request setup error: ' + error.message, { variant: 'error' });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
