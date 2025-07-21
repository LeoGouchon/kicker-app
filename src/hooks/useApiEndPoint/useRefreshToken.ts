import {api} from "../../utils/api.ts";
import {useMutation} from "@tanstack/react-query";

export const useRefreshToken = () => {
    return useMutation({
        mutationFn: async () => {
            const response = await api.post('/authenticate/refresh-token');
            return response.data
        },
        onSuccess: (response) => {
            localStorage.setItem('token', response.data.token)
        },
        onError: () => {
            localStorage.removeItem('token')
        },
        retryDelay: 1000,
        retry: 5
    })
}