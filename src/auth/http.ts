import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { mockApi } from '../utils/mockApi.ts';
import { getAccessToken, logout, refreshSession } from './client.ts';
import { identityConfig } from './config.ts';

declare module 'axios' {
    export interface AxiosRequestConfig {
        skipAuthRefresh?: boolean;
        skipAuth?: boolean;
        _authRetry?: boolean;
    }
}

const realApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

let refreshPromise: Promise<string> | undefined;

export const refreshAccessToken = async (): Promise<string> => {
    refreshPromise ??= refreshSession()
        .then((user) => user.access_token)
        .finally(() => {
            refreshPromise = undefined;
        });

    return refreshPromise;
};

realApi.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    if (!config.skipAuth && !config.url?.startsWith(identityConfig.issuer)) {
        const token = await getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

realApi.interceptors.response.use(undefined, async (error: AxiosError) => {
    const request = error.config;
    if (!request || error.response?.status !== 401 || request.skipAuthRefresh || request._authRetry) {
        throw error;
    }

    request._authRetry = true;
    try {
        const token = await refreshAccessToken();
        request.headers.Authorization = `Bearer ${token}`;
        return realApi(request);
    } catch {
        await logout().catch(() => undefined);
        throw error;
    }
});

export const api = import.meta.env.VITE_MOCK_API === 'true' ? mockApi : realApi;
