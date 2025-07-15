import {useQuery} from "@tanstack/react-query";
import {api} from "../../utils/api.ts";
import type {Pagination} from "../../types/Pagination.type.ts";
import type {Player} from "../../types/Player.type.ts";

export const useGetPlayers = ({ page, size }:{ page: number, size: number }) => {
    return useQuery({
        queryKey: ['players'],
        queryFn: async (): Promise<Pagination<Player>> => {
            try {
                return await api.get(`/players?page=${page}&size=${size}`).then(res => res.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des joueurs", error);
                throw error;
            }
        },
    });
}