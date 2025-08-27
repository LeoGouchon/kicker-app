import { useQuery } from '@tanstack/react-query';

import type { Team } from '../../types/Team.type.ts';
import { api } from '../../utils/api.ts';

export const useGetTeams = () => {
    return useQuery({
        queryKey: ['teams'],
        queryFn: async (): Promise<Team[]> => {
            try {
                return await api.get('/teams?isKicker=true&isSquash=false').then((res) => res.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des équipes', error);
                throw error;
            }
        },
    });
};
