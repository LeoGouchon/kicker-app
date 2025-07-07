import {useMutation} from "@tanstack/react-query";
import {api} from "../../utils/api.ts";

export const useLogin = () => {
    return useMutation({
        mutationFn: ({email, password}: { email: string, password: string }) => {
            return api.post('/authenticate/login', {email, password});
        },
        onSuccess: (response) => {
            localStorage.setItem('token', response.data.token)
        },
        onError: () => {
            localStorage.removeItem('token')
        }
    })
}