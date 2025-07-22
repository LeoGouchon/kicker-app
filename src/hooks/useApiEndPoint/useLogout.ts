import {useMutation} from '@tanstack/react-query';

import {api} from '../../utils/api.ts';

export const useLogout = () => {
    return useMutation({
        mutationFn: async () => {
            await api.post('/authenticate/logout');
        },
        onSuccess: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    });
};