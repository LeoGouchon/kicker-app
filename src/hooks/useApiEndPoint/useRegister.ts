import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';

import { UserContext } from '../../context/UserContext.tsx';
import { api, authRequestConfig } from '../../utils/api.ts';

export const useRegister = () => {
    const { setUser } = useContext(UserContext);

    return useMutation({
        mutationFn: async ({ email, password, token }: { email: string; password: string; token: string }) => {
            const response = await api.post(
                `/authenticate/signup?token=${token}`,
                { email: email.toLowerCase().trim(), password },
                authRequestConfig
            );
            return response.data.token;
        },
        onSuccess: async (accessToken: string) => {
            localStorage.setItem('token', accessToken);

            try {
                const responseUser = await api.get('/me');
                setUser(responseUser.data);
                localStorage.setItem('user', JSON.stringify(responseUser.data));
            } catch (err) {
                console.error("Erreur lors de la recuperation de l'utilisateur :", err);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(undefined);
            }
        },
        onError: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(undefined);
        },
    });
};
