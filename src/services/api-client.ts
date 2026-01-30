import axios, { AxiosError, AxiosInstance } from 'axios';

export const API_SERVER_BASE_URL = 'https://apisrv.zenonrobotics.ae/api/';

const createAPIClient = (baseURL: string): AxiosInstance => {
    const instance = axios.create({ baseURL, withCredentials: true });

    instance.interceptors.response.use(
        (res) => res,
        (err: AxiosError) => {
            console.error('API Error:', err.response?.data || err.message);
            return Promise.reject(err);
        },
    );

    return instance;
};

export const apiClientClient = createAPIClient('/api/');

export const apiClientServer = createAPIClient(API_SERVER_BASE_URL);
