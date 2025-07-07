import {api} from "../../utils/api.ts";
import {useMutation} from "@tanstack/react-query";

export const useRefreshToken = () => {
    return useMutation({
        mutationFn: () => {
            return api.post('/authenticate/refresh-token')
        },
        onSuccess: (response) => {
            localStorage.setItem('token', response.data.token)
        },
        onError: () => {
            localStorage.removeItem('token')
        }
    })
}