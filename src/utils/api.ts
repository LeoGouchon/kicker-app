import axios from "axios";

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

        if (error.response?.status === 401 && !originalRequest._retry && token) {
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
            }
        }

        return Promise.reject(
            error instanceof Error ? error : new Error(String(error))
        );
    }
);