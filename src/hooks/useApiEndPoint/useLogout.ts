import {api} from "../../utils/api.ts";
import {useMutation} from "@tanstack/react-query";
import {UserContext} from "../../context/UserContext.tsx";
import {useContext} from "react";

export const useLogout = () => {
    const {setUser} = useContext(UserContext);

    return useMutation({
        mutationFn: async () => {
            await api.post('/authenticate/logout');
        },
        onSuccess: () => {
            localStorage.removeItem('token');
            setUser(undefined);
        }
    })
}