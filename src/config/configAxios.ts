import axiosInstance from '@/app/api/axiosInstance';
import { useAuthStore } from '@/store/auth';

interface FailedQueueItem {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

interface WithoutToastRequest {
  key: string;
  method?: string;
  resultCodes?: string | string[];
  statusCodes?: string | string[];
  message?: string;
  lookUpMode?: 'START' | 'END' | 'INCLUDE';
}

const withoutToastRequests: WithoutToastRequest[] = [
  { key: '/confirm', method: 'put', resultCodes: '*', message: '', lookUpMode: 'END' },
];

const requestTimeoutList = {
  timeout: 1_000,
  urls: [] as { url: string; timeout?: number; method?: string }[],
};

// Timer util
const requestTimer = {
  startTime: 0,
  start() {
    this.startTime = Date.now();
  },
  stop() {
    return Date.now() - this.startTime;
  },
};

// Refresh token queue
let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((item) => {
    if (error) item.reject(error);
    else item.resolve(token!);
  });
  failedQueue = [];
};

export const configAxios = () => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      requestTimer.start();

      const { accessToken } = useAuthStore();

      config.baseURL = process.env.NEXT_PUBLIC_API_URL;
      config.headers = config.headers || {};

      config.headers['Content-Type'] = 'application/json';

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    async (response) => {
      const requestTime = requestTimer.stop();
      const getData = () => response.data || response;

      // Handle custom timeout per request
      const timeoutConfig = requestTimeoutList.urls.find((item) => response.config.url?.includes(item.url));
      const delay = timeoutConfig?.timeout || requestTimeoutList.timeout;
      const remainingTime = Math.max(delay - requestTime, 0);

      if (remainingTime > 0) {
        await new Promise((res) => setTimeout(res, remainingTime));
      }

      return getData();
    },
    async (error) => {
      const originalRequest = error.config;

      if (!originalRequest) return Promise.reject(error);

      // Refresh token logic
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise((resolve, reject) => {
          const { accessToken, refreshToken = '', loginSuccess, logout } = useAuthStore();

          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}auth/v1.0/token/refresh/${refreshToken}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.status?.code === 200) {
                const newTokenData = data.result.data;
                loginSuccess(newTokenData.token, refreshToken as string);
                processQueue(false, newTokenData.token);
                originalRequest.headers.Authorization = `${newTokenData.type} ${newTokenData.token}`;
                axiosInstance.defaults.headers.common.Authorization = `${newTokenData.type} ${newTokenData.token}`;
                resolve(axiosInstance(originalRequest));
              } else throw new Error('refresh token failed');
            })
            .catch(async (err) => {
              await logout();
              processQueue(err, null);
              reject(err);
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      }

      // Handle 403 or fallback
      if (error.response?.status === 403) {
        console.warn('Forbidden access, fallback triggered');
        // fallbackProcessIfRefreshTokenHasFailed();
      }

      // Without toast check
      const toastChecker = withoutToastRequests.find((req) => {
        if (!originalRequest.url) return false;
        switch (req.lookUpMode) {
          case 'END':
            return originalRequest.url.endsWith(req.key);
          case 'START':
            return originalRequest.url.startsWith(req.key);
          default:
            return originalRequest.url.includes(req.key);
        }
      });

      const originalRequestErrorCode = error?.response?.data?.error?.code;
      const originalRequestStatusCode = error?.response?.data?.status?.code;

      if (
        toastChecker &&
        (toastChecker.resultCodes === '*' ||
          toastChecker.statusCodes === '*' ||
          toastChecker.resultCodes?.includes(originalRequestErrorCode) ||
          toastChecker.statusCodes?.includes(originalRequestStatusCode)) &&
        (!toastChecker.method || toastChecker.method === originalRequest.method)
      ) {
        return Promise.reject({
          whiteListMessage: toastChecker.message,
          code: originalRequestErrorCode,
          message: originalRequestErrorCode,
        });
      }

      return Promise.reject(error);
    },
  );
};

configAxios();
