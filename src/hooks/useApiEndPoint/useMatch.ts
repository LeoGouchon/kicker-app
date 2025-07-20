import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {Pagination} from "../../types/Pagination.type.ts";
import type {Match} from "../../types/Match.type.ts";
import {api} from "../../utils/api.ts";
import type {SortOrder} from "antd/es/table/interface";

type UseGetMatchesParams = {
    page: number;
    size: number;
};

export const useGetMatches = ({ page, size }: UseGetMatchesParams) => {
    return useQuery<Pagination<Match>>({
        queryKey: ['matches', page, size],
        queryFn: async () => {
            const res = await api.get(`/kicker/matches?page=${page}&size=${size}`);
            return res.data;
        },
        staleTime: 1000 * 60,
    });
};

export const useGetInfiniteMatches = (size: number = 10, dateOrder: SortOrder = "ascend") => {
    return useInfiniteQuery({
        queryKey: ['matches', size, dateOrder],
        queryFn: async ({ pageParam = 0 }: { pageParam: number }): Promise<Pagination<Match>> => {
            const res = await api.get(`/kicker/matches?page=${pageParam}&size=${size}&dateOrder=${dateOrder}`);
            return res.data;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.currentPage + 1;
            return nextPage < lastPage.totalPages ? nextPage : undefined;
        },
        staleTime: 1000 * 60, // 1 minute
    });
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