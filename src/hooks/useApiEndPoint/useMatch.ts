import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {Pagination} from "../../types/Pagination.type.ts";
import type {Match} from "../../types/Match.type.ts";
import {api} from "../../utils/api.ts";

export const useGetMatches = ({page, size}: { page: number, size: number }) => {
    return useQuery({
        queryKey: ['matches', page, size],
        queryFn: async (): Promise<Pagination<Match>> => {
            try {
                return await api.get(`/kicker/matches?page=${page}&size=${size}`).then(res => res.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des matches", error);
                throw error;
            }
        },
    })
};

export const useCreateMatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (match: {
            scoreA: number,
            scoreB: number,
            player1AId: string,
            player2AId?: string,
            player1BId: string,
            player2BId?: string
        }): Promise<Match> => {
            try {
                return await api.post('/kicker/matches', match).then(res => res.data);
            } catch (error) {
                console.error("Erreur lors de la création du match", error);
                throw error;
            }
        },
        onSuccess: () => {
            return queryClient.invalidateQueries({queryKey: ['matches'], exact: false});
        }
    })
}