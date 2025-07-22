import {useMutation} from '@tanstack/react-query';
import {useContext} from 'react';

import {UserContext} from '../../context/UserContext.tsx';
import {api} from '../../utils/api.ts';

export const useLogin = () => {
    const {setUser} = useContext(UserContext);

    return useMutation({
        mutationFn: async ({email, password}: { email: string, password: string }) => {
            const response = await api.post('/authenticate/login', {email, password});
            return response.data.token;
        },
        onSuccess: async (token: string) => {
            localStorage.setItem('token', token);

            try {
                const responseUser = await api.get('/me');
                setUser(responseUser.data);
                localStorage.setItem('user', JSON.stringify(responseUser.data));
            } catch (err) {
                console.error('Erreur lors de la récupération de l\'utilisateur :', err);
                localStorage.removeItem('token');
                setUser(undefined);
            }
        },
        onError: () => {
            localStorage.removeItem('token');
        }
    });
};