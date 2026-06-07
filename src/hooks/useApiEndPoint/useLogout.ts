import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';

import { UserContext } from '../../context/UserContext.tsx';
import { api, authRequestConfig } from '../../utils/api.ts';

export const useLogout = () => {
    const { setUser } = useContext(UserContext);

    return useMutation({
        mutationFn: async () => {
            await api.post('/authenticate/logout', undefined, authRequestConfig);
        },
        onSettled: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(undefined);
        },
    });
};
