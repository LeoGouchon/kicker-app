import {useMutation} from "@tanstack/react-query";
import {api} from "../../utils/api.ts";

export const useInvite = () => {
    return useMutation({
        mutationFn: async (playerId: string): Promise<{token: string}> => {
            const response = await api.post(`/admin/invitation`, {playerId});
            return response.data
        }
    })
}