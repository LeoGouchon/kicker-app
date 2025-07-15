import axios from "axios";
import {ROUTES} from "../routes/constant.ts";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error instanceof Error ? error : new Error(String(error)))
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const token = localStorage.getItem('token');

        const isRefreshingToken = originalRequest.url?.includes('/authenticate/refresh-token');

        if (error.response?.status === 401 && token && !originalRequest._retry && !isRefreshingToken) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await api.post('/authenticate/refresh-token');
                const newAccessToken: string = refreshResponse.data.token;

                localStorage.setItem('token', newAccessToken);

                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                console.error('Échec du refresh token:', refreshError);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.replace(ROUTES.HOME);
            }
        }

        return Promise.reject(
            error instanceof Error ? error : new Error(String(error))
        );
    }
);