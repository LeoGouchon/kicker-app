import { createContext, type ReactNode, useEffect, useMemo, useState } from 'react';

import { useLazyMe } from '../hooks/useApiEndPoint/useMe.ts';
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
    const [user, setUser] = useState<UserType | undefined>(undefined);
    const [isInitializing, setIsInitializing] = useState(true);

    const refreshToken = useRefreshToken();
    const [fetchMe, { data: userData }] = useLazyMe();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsInitializing(false);
            setUser(undefined);
            return;
        }

        refreshToken.mutate(undefined, {
            onSuccess: (response) => {
                localStorage.setItem('token', response.token);
                fetchMe();
            },
            onError: () => {
                localStorage.removeItem('token');
                setUser(undefined);
                setIsInitializing(false);
            },
        });
    }, []);

    useEffect(() => {
        if (userData) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } else if (!isInitializing) {
            setUser(undefined);
            localStorage.removeItem('user');
        }
    }, [userData, isInitializing]);

    const value: UserContextType = useMemo(() => ({ user, setUser }), [user]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
