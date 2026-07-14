import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SortOrder } from 'antd/es/table/interface';

import type { Match } from '../../types/Match.type.ts';
import type { Pagination } from '../../types/Pagination.type.ts';
import type { PlayerFilter } from '../../types/PlayerFilter.type.ts';
import { api } from '../../utils/api.ts';
import { constructComplexPlayerFilter } from '../../utils/apiConstruct/constructComplexPlayerFilter.ts';

type CreateMatchPayload = {
    scoreA: number;
    scoreB: number;
    player1AId: string;
    player2AId?: string;
    player1BId: string;
    player2BId?: string;
};

type UseGetMatchesParams = {
    page: number;
    size: number;
    dateOrder?: SortOrder;
    date?: number;
    playerFilter?: PlayerFilter;
    playerIds?: string[];
};

export const useGetMatches = ({
    page,
    size,
    dateOrder = 'descend',
    date,
    playerIds,
    playerFilter,
}: UseGetMatchesParams) => {
    const formattedPlayerIds = playerIds?.map((playerId) => `&playerIds=${playerId}`).join('') ?? '';
    const formattedDateOrder = dateOrder ? '&dateOrder=' + dateOrder : '';
    const formattedPlayerFilter = constructComplexPlayerFilter(playerFilter);
    const formattedDate = date ? `&date=${date}` : '';

    return useQuery<Pagination<Match>>({
        queryKey: ['matches', page, size, dateOrder, date, playerIds, playerFilter],
        queryFn: async () => {
            const res = await api.get(
                `/kicker/matches?page=${page}&size=${size}${formattedDate}${formattedDateOrder}${formattedPlayerIds}${formattedPlayerFilter}`
            );
            return res.data;
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60,
    });
};

export const useGetInfiniteMatches = ({
    size = 10,
    dateOrder = 'descend',
    playerIds,
    playerFilter,
}: {
    size?: number;
    dateOrder?: SortOrder;
    playerFilter?: PlayerFilter;
    playerIds?: string[];
}) => {
    const formattedPlayerIds = playerIds?.map((playerId) => `&playerIds=${playerId}`).join('') ?? '';
    const formattedDateOrder = dateOrder ? '&dateOrder=' + dateOrder : '';
    const formattedPlayerFilter = constructComplexPlayerFilter(playerFilter);

    return useInfiniteQuery({
        queryKey: ['matches', size, dateOrder, playerIds],
        queryFn: async ({ pageParam = 0 }: { pageParam: number }): Promise<Pagination<Match>> => {
            const res = await api.get(
                `/kicker/matches?page=${pageParam}&size=${size}${formattedDateOrder}${formattedPlayerIds}${formattedPlayerFilter}`
            );
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
        mutationFn: async (match: CreateMatchPayload): Promise<Match> => {
            try {
                return await api.post('/kicker/matches', match).then((res) => res.data);
            } catch (error) {
                console.error('Erreur lors de la création du match', error);
                throw error;
            }
        },
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: ['matches'], exact: false });
        },
    });
};

export const useCreatePublicMatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ code, match }: { code: string; match: CreateMatchPayload }): Promise<Match> => {
            try {
                return await api
                    .post('/kicker/matches/public', { code, match }, { skipAuthRefresh: true })
                    .then((res) => res.data);
            } catch (error) {
                console.error('Erreur lors de la création du match public', error);
                throw error;
            }
        },
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: ['matches'], exact: false });
        },
    });
};

export const useDeleteMatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await api.delete(`/kicker/matches/${id}`);
        },
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: ['matches'], exact: false });
        },
    });
};
