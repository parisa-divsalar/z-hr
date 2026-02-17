import axios, { AxiosError, AxiosInstance } from 'axios';

import { useAuthStore } from '@/store/auth';

export const API_SERVER_BASE_URL = 'https://apisrv.zenonrobotics.ae/api/';

const createAPIClient = (baseURL: string): AxiosInstance => {
    const instance = axios.create({
        baseURL,
        withCredentials: true,
        // Avoid infinite pending requests in the UI.
        timeout: 60000,
    });

    // Attach Bearer token when available (client-side auth store).
    // This keeps `/api/*` calls working even when cookie session isn't present.
    instance.interceptors.request.use((config) => {
        if (typeof window === 'undefined') return config;

        try {
            const token = useAuthStore.getState().accessToken;
            if (token && !config.headers?.Authorization) {
                config.headers = config.headers ?? {};
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch {
            // ignore
        }

        return config;
    });

    instance.interceptors.response.use(
        (res) => {
            // If an API call changes user credits, notify the UI to refresh `/api/users/me`.
            // This keeps Navbar coin display in sync after spending credits.
            if (typeof window !== 'undefined') {
                const url = String(res?.config?.url ?? '');
                const creditChangingEndpoints = [
                    'cv/analyze',
                    'cv/edit-cv',
                    'cv/cover-letter',
                    'skills/analyze-gap',
                    'files/extract-text',
                ];
                if (creditChangingEndpoints.some((p) => url.includes(p))) {
                    window.dispatchEvent(new Event('zcv:profile-changed'));
                }
            }
            return res;
        },
        (err: AxiosError) => {
            console.error('API Error:', err.response?.data || err.message);
            return Promise.reject(err);
        },
    );

    return instance;
};

export const apiClientClient = createAPIClient('/api/');

export const apiClientServer = createAPIClient(API_SERVER_BASE_URL);
