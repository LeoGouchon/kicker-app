import { useQuery } from '@tanstack/react-query';

import type { MatrixScore, MatrixScoreRealResult } from '../../types/MatrixScore.type.ts';
import { api } from '../../utils/api.ts';

export const useGetMatrixScore = () => {
    return useQuery({
        queryKey: ['matrix-score'],
        queryFn: async (): Promise<MatrixScore[]> => {
            const res = await api.get('/kicker/stats/matrix-score');
            return res.data;
        },
        staleTime: 1000 * 60 * 60,
    });
};

export const useGetMatrixScoreRealResults = () => {
    return useQuery({
        queryKey: ['matrix-score-real-results'],
        queryFn: async (): Promise<MatrixScoreRealResult[]> => {
            const res = await api.get('/kicker/stats/matrix-score/results');
            return res.data;
        },
        staleTime: 1000 * 60 * 60,
    });
};
