import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';

import { logout } from '../../auth/client.ts';
import { UserContext } from '../../context/UserContext.tsx';

export const useLogout = () => {
    const { clearSession } = useContext(UserContext);

    return useMutation({
        mutationFn: logout,
        onSettled: clearSession,
    });
};
