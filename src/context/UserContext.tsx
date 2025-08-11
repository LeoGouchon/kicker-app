import { createContext, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';

import { useRefreshToken } from '../hooks/useApiEndPoint/useRefreshToken.ts';
import type { UserType } from '../types/User.type.ts';

interface UserContextType {
    user?: UserType;
    setUser: (newUser?: UserType) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<UserContextType>({
    user: undefined,
    setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | undefined>(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : undefined;
    });
    const didRunRef = useRef(false);

    const refreshToken = useRefreshToken();

    useEffect(() => {
        if (didRunRef.current) return;
        didRunRef.current = true;

        const storedUser = localStorage.getItem('user');
        console.log('storedUser', storedUser);
        if (storedUser) {
            console.log('ligne 26');
            refreshToken.mutate(undefined, {
                onSuccess: (response) => {
                    console.log('refresh token success');
                    localStorage.setItem('token', response.data.token);
                    setUser(JSON.parse(storedUser));
                },
                onError: () => {
                    console.log('refresh token error');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(undefined);
                },
            });
        }
    }, []);

    useEffect(() => {
        if (user !== undefined) {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('user');
            }
        }
    }, [user]);

    const value: UserContextType = useMemo(
        () => ({
            user,
            setUser,
        }),
        [user]
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
