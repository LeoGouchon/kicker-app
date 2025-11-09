import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { GlobalStats } from '../../types/GlobalStats.type.ts';
import type { PlayerStats } from '../../types/PlayerStats.type.ts';
import type { SeasonsStats } from '../../types/SeasonsStats.type.ts';
import { api } from '../../utils/api.ts';

export const useGetGlobalStats = ({ year, quarter }: { year?: number; quarter?: number } = {}) => {
    return useQuery({
        queryKey: ['global-stats', year, quarter],
        queryFn: async (): Promise<GlobalStats[]> => {
            const endpoint = year && quarter ? `/kicker/stats/season/${year}/${quarter}` : '/kicker/stats/global';
            const res = await api.get(endpoint);
            return res.data;
        },
    });
};

export const useResetElo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await api.post('/kicker/matches/recalculate-elo');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['global-stats'], exact: false });
        },
    });
};

export const useGetSeasonsStats = () => {
    return useQuery({
        queryKey: ['seasons-stats'],
        queryFn: async (): Promise<SeasonsStats> => {
            const res = await api.get('/kicker/stats/season');
            return res.data;
        },
        select: (data: SeasonsStats) => ({
            ...data,
            seasonsStats: data.seasonsStats
                ?.sort((a, b) => (a.year !== b.year ? a.year - b.year : a.quarter - b.quarter))
                .map((season, index) => ({
                    ...season,
                    seasonIndex: index + 1,
                })),
        }),
    });
};

export const useGetPlayerStats = ({ playerId }: { playerId: string }) => {
    return useQuery({
        queryKey: ['player-stats', playerId],
        queryFn: async (): Promise<PlayerStats> => {
            const res = await api.get(`/kicker/stats/player/${playerId}`);
            return res.data;
        },
    });
};
