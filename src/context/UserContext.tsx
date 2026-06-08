import { createContext, type Dispatch, type ReactNode, type SetStateAction, useEffect, useMemo, useState } from 'react';

import { useLazyMe } from '../hooks/useApiEndPoint/useMe.ts';
import { useRefreshToken } from '../hooks/useApiEndPoint/useRefreshToken.ts';
import type { UserType } from '../types/User.type.ts';

interface UserContextType {
    user?: UserType;
    setUser: Dispatch<SetStateAction<UserType | undefined>>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<UserContextType>({
    user: undefined,
    setUser: () => {},
});

const getStoredUser = (): UserType | undefined => {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
        return undefined;
    }

    try {
        return JSON.parse(rawUser) as UserType;
    } catch {
        localStorage.removeItem('user');
        return undefined;
    }
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | undefined>(() => getStoredUser());
    const [isInitializing, setIsInitializing] = useState(true);

    const { mutate: refreshAccessToken } = useRefreshToken();
    const [fetchMe, { data: userData }] = useLazyMe();

    useEffect(() => {
        refreshAccessToken(undefined, {
            onSuccess: (response) => {
                localStorage.setItem('token', response.token);
                fetchMe().finally(() => setIsInitializing(false));
            },
            onError: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(undefined);
                setIsInitializing(false);
            },
        });
    }, [fetchMe, refreshAccessToken]);

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
