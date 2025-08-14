import { useMutation } from '@tanstack/react-query';

import { api } from '../../utils/api.ts';

export const useRefreshToken = () => {
    return useMutation({
        mutationFn: async () => {
            const response = await api.post('/authenticate/refresh-token');
            return response.data;
        },
        retryDelay: 1000,
        retry: 5,
    });
};
