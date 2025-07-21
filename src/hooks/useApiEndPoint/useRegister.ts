import {useMutation} from "@tanstack/react-query";
import {api} from "../../utils/api.ts";

export const useRegister = () => {
    return useMutation({
        mutationFn: async ({email, password, token}: { email: string, password: string, token: string }) => {
            const response = await api.post(`/authenticate/signup?token=${token}`, {email, password});
            return response.data.token;
        },
    });
}