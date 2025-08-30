import { useQuery } from '@tanstack/react-query';

import type { MatrixScore } from '../../types/MatrixScore.type.ts';
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
