import {api} from "../../utils/api.ts";
import {useMutation} from "@tanstack/react-query";

export const useLogout = () => {
    return useMutation({
        mutationFn: () => {
            return api.post('/authenticate/logout')
        },
        onSuccess: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    })
}