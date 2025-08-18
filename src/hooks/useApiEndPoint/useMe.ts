import { useQuery } from '@tanstack/react-query';

import { api } from '../../utils/api.ts';

export const useLazyMe = () => {
    const query = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const response = await api.get('/me');
            return response.data;
        },
        enabled: false, // le fetch ne se fait pas automatiquement
    });

    return [query.refetch, query] as const; // tuple: [triggerFetch, queryData]
};
