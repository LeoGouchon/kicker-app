import axios from 'axios';

import { ROUTES } from '../routes/constant.ts';
import { mockApi } from './mockApi.ts';

const AUTHENTICATE_PATH = '/authenticate/';

const realApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export const authRequestConfig = {
    withCredentials: true,
};

let refreshAccessTokenPromise: Promise<string> | undefined;

export const refreshAccessToken = async () => {
    refreshAccessTokenPromise ??= (
        import.meta.env.VITE_MOCK_API === 'true'
            ? mockApi.post('/authenticate/refresh-token', undefined, authRequestConfig)
            : refreshApi.post('/authenticate/refresh-token', undefined, authRequestConfig)
    )
        .then((response) => response.data.token as string)
        .finally(() => {
            refreshAccessTokenPromise = undefined;
        });

    return refreshAccessTokenPromise;
};

realApi.interceptors.request.use(
    (config) => {
        const isAuthenticateRequest = config.url?.includes(AUTHENTICATE_PATH);
        const token = localStorage.getItem('token');

        if (token && !isAuthenticateRequest) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error instanceof Error ? error : new Error(String(error)))
);

realApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isAuthenticateRequest = originalRequest?.url?.includes(AUTHENTICATE_PATH);

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthenticateRequest) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshAccessToken();

                localStorage.setItem('token', newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return realApi(originalRequest);
            } catch (refreshError) {
                console.error('Echec du refresh token:', refreshError);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                globalThis.location.replace(ROUTES.HOME);
            }
        }

        throw error instanceof Error ? error : new Error(String(error));
    }
);

export const api = import.meta.env.VITE_MOCK_API === 'true' ? mockApi : realApi;
