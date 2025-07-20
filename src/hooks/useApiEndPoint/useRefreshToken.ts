import {api} from "../../utils/api.ts";
import {useMutation} from "@tanstack/react-query";

export const useRefreshToken = () => {
    return useMutation({
        mutationFn: async () => {
            return api.post('/authenticate/refresh-token').then(res => res.data);
        },
        onSuccess: (response) => {
            localStorage.setItem('token', response.token)
        },
        onError: () => {
            localStorage.removeItem('token')
        },
        retryDelay: 1000,
        retry: 5
    })
}