import { useMutation } from '@tanstack/react-query';

import { refreshAccessToken } from '../../utils/api.ts';

export const useRefreshToken = () => {
    return useMutation({
        mutationFn: async () => {
            const token = await refreshAccessToken();
            return { token };
        },
        retry: false,
    });
};
