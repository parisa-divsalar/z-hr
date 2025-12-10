import axios, { AxiosError, AxiosInstance } from 'axios';

const createAPIClient = (baseURL: string): AxiosInstance => {
    const instance = axios.create({ baseURL });

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

export const apiClientServer = createAPIClient('https://apisrv.zenonrobotics.ae/api/Apps/');
