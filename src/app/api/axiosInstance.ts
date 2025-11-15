import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 30_000,
  timeoutErrorMessage: 'timeout',
});

export default axiosInstance;
