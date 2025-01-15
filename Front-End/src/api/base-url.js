import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

// const LOCAL = import.meta.env.VITE_APP_API_LOCAL;
const SERVER = import.meta.env.VITE_APP_API_SERVER;

const axiosInstance = axios.create({
  baseURL: SERVER,
  timeout: 10000
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
      enqueueSnackbar('Response error: ' + error.response.data.message || error.message, { variant: 'error' });
    } else if (error.request) {
      enqueueSnackbar('No response received: ' + error.message, { variant: 'error' });
    } else {
      enqueueSnackbar('Request setup error: ' + error.message, { variant: 'error' });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
