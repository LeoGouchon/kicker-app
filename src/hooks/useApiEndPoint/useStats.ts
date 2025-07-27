import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { GlobalStats } from '../../types/GlobalStats.type.ts';
import { api } from '../../utils/api.ts';

export const useGetGlobalStats = () => {
    return useQuery({
        queryKey: ['global-stats'],
        queryFn: async (): Promise<GlobalStats[]> => {
            const res = await api.get('/kicker/stats/global');
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
